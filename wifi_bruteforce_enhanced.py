#!/usr/bin/env python3

# Enhanced WiFi Security Testing Script with Node.js Integration
# For educational purposes only - Use only on networks you own or have permission to test

import os
import sys
import time
import subprocess
import re
import signal
import shutil
import tempfile
import csv
import json
import argparse
import threading
from datetime import datetime

try:
    from colorama import Fore, Style, init
    init()
    COLORAMA_AVAILABLE = True
except ImportError:
    # Graceful fallback when colorama is not available
    COLORAMA_AVAILABLE = False
    class Fore:
        BLUE = RED = GREEN = YELLOW = WHITE = CYAN = ""
    class Style:
        RESET_ALL = ""

# Global variables
temp_dir = None
monitor_interface = None
integration_mode = False
auto_mode = False

def print_status(status_type, message, data=None):
    """Print status message that can be parsed by Node.js integration"""
    if data is None:
        data = {}
    
    status = {
        "type": status_type,
        "message": message,
        "timestamp": time.time(),
        "data": data
    }
    
    # Print JSON status for programmatic parsing
    if integration_mode:
        print(f"STATUS_JSON:{json.dumps(status)}")
    
    # Also print human-readable format
    colors = {
        "info": Fore.BLUE,
        "success": Fore.GREEN,
        "warning": Fore.YELLOW,
        "error": Fore.RED
    }
    color = colors.get(status_type, Fore.WHITE)
    print(f"{color}[{status_type.upper()}] {message}{Style.RESET_ALL}")

def check_integration_mode():
    """Check if script is being called from Node.js integration"""
    global integration_mode, auto_mode
    
    parser = argparse.ArgumentParser(description='WiFi Security Testing Tool')
    parser.add_argument('--integration', action='store_true', 
                        help='Run in integration mode for Node.js bridge')
    parser.add_argument('--auto-mode', action='store_true',
                        help='Run with minimal user interaction')
    parser.add_argument('--target-ssid', type=str,
                        help='Target SSID for testing')
    parser.add_argument('--wordlist', type=str,
                        help='Path to wordlist file')
    parser.add_argument('--check-only', action='store_true',
                        help='Only check if tools are available')
    
    args = parser.parse_args()
    integration_mode = args.integration
    auto_mode = args.auto_mode
    
    return args

def print_banner(integration_mode=False):
    """Print the script banner"""
    if not integration_mode:
        print(f"{Fore.BLUE}===================================================")
        print(f"    Enhanced WiFi Security Testing Tool")
        print(f"===================================================")
        print(f"{Fore.RED}WARNING: Only use on networks you own or have permission to test")
        print(f"{Fore.BLUE}==================================================={Style.RESET_ALL}\n")
    else:
        print_status("info", "Enhanced WiFi Security Testing Tool - Integration Mode")
        print_status("warning", "Only use on networks you own or have permission to test")

def check_root():
    """Check if script is run as root"""
    if os.geteuid() != 0:
        print_status("error", "This script must be run as root")
        sys.exit(1)

def check_requirements(check_only=False):
    """Check if required tools are installed"""
    print_status("info", "Checking for required tools...")
    
    tools = {
        "aircrack-ng": "Main cracking tool",
        "airodump-ng": "Packet capture tool", 
        "aireplay-ng": "Replay attack tool",
        "macchanger": "MAC address changing tool",
        "iwconfig": "Wireless configuration tool"
    }
    
    missing = []
    available = []
    
    for tool, description in tools.items():
        if shutil.which(tool) is None:
            missing.append(tool)
            print_status("error", f"{tool} not found - {description}")
        else:
            available.append(tool)
            print_status("success", f"{tool} is available - {description}")
    
    if missing:
        print_status("warning", f"Missing tools: {', '.join(missing)}")
        print_status("info", "Install missing tools with: sudo apt-get install aircrack-ng wireless-tools")
        
        if check_only:
            return {"available": available, "missing": missing, "ready": len(missing) == 0}
        else:
            sys.exit(1)
    else:
        print_status("success", "All required tools are installed")
        if check_only:
            return {"available": available, "missing": [], "ready": True}

def get_wireless_interfaces():
    """Get available wireless interfaces"""
    interfaces = []
    
    try:
        # Method 1: Check iwconfig output
        result = subprocess.run("iwconfig 2>/dev/null", shell=True, capture_output=True, text=True)
        for line in result.stdout.splitlines():
            if "IEEE 802.11" in line:
                interface = line.split()[0]
                interfaces.append(interface)
        
        # Method 2: Check /proc/net/wireless as fallback
        if not interfaces and os.path.exists("/proc/net/wireless"):
            with open("/proc/net/wireless", 'r') as f:
                for line in f.readlines()[2:]:  # Skip header lines
                    if line.strip():
                        interface = line.split(':')[0].strip()
                        if interface:
                            interfaces.append(interface)
    except Exception as e:
        print_status("error", f"Failed to detect wireless interfaces: {e}")
    
    return list(set(interfaces))  # Remove duplicates

def enable_monitor_mode(interface=None):
    """Put wireless interface in monitor mode"""
    global monitor_interface
    
    interfaces = get_wireless_interfaces()
    
    if not interfaces:
        print_status("error", "No wireless interfaces found")
        return False
    
    print_status("info", f"Available wireless interfaces: {', '.join(interfaces)}")
    
    if interface and interface in interfaces:
        selected_interface = interface
    elif auto_mode and interfaces:
        selected_interface = interfaces[0]
        print_status("info", f"Auto-selected interface: {selected_interface}")
    else:
        print(f"{Fore.YELLOW}Available interfaces:{Style.RESET_ALL}")
        for i, iface in enumerate(interfaces, 1):
            print(f"  {i}. {iface}")
        
        while True:
            try:
                choice = input(f"{Fore.YELLOW}Enter interface number or name: {Style.RESET_ALL}")
                if choice.isdigit():
                    choice = int(choice)
                    if 1 <= choice <= len(interfaces):
                        selected_interface = interfaces[choice - 1]
                        break
                elif choice in interfaces:
                    selected_interface = choice
                    break
                print_status("error", "Invalid selection")
            except (ValueError, KeyboardInterrupt):
                print_status("error", "Invalid input")
                return False
    
    print_status("info", f"Putting {selected_interface} into monitor mode...")
    
    # Kill interfering processes
    subprocess.run("airmon-ng check kill > /dev/null 2>&1", shell=True)
    
    # Start monitor mode
    result = subprocess.run(f"airmon-ng start {selected_interface}", shell=True, capture_output=True, text=True)
    
    # Find the monitor interface
    monitor_result = subprocess.run("iwconfig 2>/dev/null | grep -i 'mode:monitor'", shell=True, capture_output=True, text=True)
    
    if monitor_result.stdout:
        monitor_interface = monitor_result.stdout.split()[0]
        print_status("success", f"Monitor mode enabled on interface: {monitor_interface}")
        return True
    else:
        print_status("error", "Failed to enable monitor mode")
        return False

def scan_networks_advanced(duration=30):
    """Enhanced network scanning with better integration support"""
    global temp_dir
    
    if not monitor_interface:
        print_status("error", "No monitor interface available")
        return []
    
    print_status("info", f"Scanning for WiFi networks for {duration} seconds...")
    
    # Create temp directory for files
    temp_dir = tempfile.mkdtemp()
    scan_file = os.path.join(temp_dir, "scan")
    
    # Start scanning
    scan_process = subprocess.Popen(
        f"timeout {duration} airodump-ng -w {scan_file} --output-format csv {monitor_interface}",
        shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    
    # Wait for scan to complete
    scan_process.wait()
    
    # Parse results
    networks_file = f"{scan_file}-01.csv"
    networks = []
    
    if os.path.isfile(networks_file):
        try:
            with open(networks_file, 'r', encoding='utf-8') as csvfile:
                reader = csv.reader(csvfile)
                for row in reader:
                    # Skip empty rows and headers
                    if not row or len(row) < 14 or row[0].strip() in ["BSSID", "Station MAC"]:
                        continue
                    
                    # Process access point rows
                    if row[0].strip() and row[13].strip():
                        network = {
                            "bssid": row[0].strip(),
                            "frequency": row[1].strip() if len(row) > 1 else "",
                            "speed": row[2].strip() if len(row) > 2 else "",
                            "channel": row[3].strip() if len(row) > 3 else "",
                            "privacy": row[5].strip() if len(row) > 5 else "",
                            "power": row[8].strip() if len(row) > 8 else "",
                            "beacons": row[9].strip() if len(row) > 9 else "",
                            "essid": row[13].strip() if len(row) > 13 else ""
                        }
                        networks.append(network)
        except Exception as e:
            print_status("error", f"Failed to parse scan results: {e}")
    
    print_status("success", f"Found {len(networks)} networks")
    
    for i, network in enumerate(networks[:10], 1):  # Show first 10
        print_status("info", f"Network {i}: {network['essid']} (Channel: {network['channel']}, Security: {network['privacy']})")
    
    return networks

def create_sample_wordlist():
    """Create a sample wordlist for demonstration"""
    wordlist_path = os.path.join(temp_dir, "sample_wordlist.txt")
    
    # Common WiFi passwords for educational purposes
    common_passwords = [
        "password", "12345678", "password123", "admin", "123456789",
        "qwerty123", "welcome", "letmein", "password1", "123123123",
        "admin123", "root", "toor", "pass", "test"
    ]
    
    with open(wordlist_path, 'w') as f:
        for password in common_passwords:
            f.write(password + '\n')
    
    print_status("info", f"Created sample wordlist at {wordlist_path} with {len(common_passwords)} passwords")
    return wordlist_path

def run_compatibility_check():
    """Run a comprehensive compatibility check"""
    print_status("info", "Running comprehensive compatibility check...")
    
    checks = {
        "root_privileges": os.geteuid() == 0,
        "wireless_interfaces": len(get_wireless_interfaces()) > 0,
        "aircrack_suite": shutil.which("aircrack-ng") is not None,
        "monitor_mode_support": False,
        "system_info": {
            "platform": sys.platform,
            "python_version": sys.version,
            "uid": os.geteuid() if hasattr(os, 'geteuid') else 'N/A'
        }
    }
    
    # Test monitor mode capability (if we have root)
    if checks["root_privileges"] and checks["wireless_interfaces"]:
        interfaces = get_wireless_interfaces()
        if interfaces:
            # Test if we can get interface info without actually changing mode
            test_interface = interfaces[0]
            result = subprocess.run(f"iwconfig {test_interface}", shell=True, capture_output=True)
            checks["monitor_mode_support"] = result.returncode == 0
    
    print_status("success", "Compatibility check completed", checks)
    return checks

def cleanup_and_exit(exit_code=0):
    """Clean up and restore normal wireless operation"""
    global monitor_interface, temp_dir
    
    print_status("info", "Cleaning up and restoring normal wireless operation...")
    
    # Disable monitor mode
    if monitor_interface:
        subprocess.run(f"airmon-ng stop {monitor_interface} > /dev/null 2>&1", shell=True)
        print_status("success", f"Disabled monitor mode on {monitor_interface}")
    
    # Restart network manager
    subprocess.run("service NetworkManager restart > /dev/null 2>&1 || service networking restart > /dev/null 2>&1", shell=True)
    
    # Remove temporary files
    if temp_dir and os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
        print_status("success", "Removed temporary files")
    
    print_status("success", "Cleanup complete")
    sys.exit(exit_code)

def main():
    """Enhanced main function with integration support"""
    try:
        # Parse command line arguments
        args = check_integration_mode()
        
        print_banner(integration_mode)
        
        # Handle check-only mode
        if args.check_only:
            result = check_requirements(check_only=True)
            compatibility = run_compatibility_check()
            
            final_result = {
                "requirements": result,
                "compatibility": compatibility,
                "integration_mode": integration_mode,
                "ready_for_testing": result["ready"] and compatibility["root_privileges"]
            }
            
            if integration_mode:
                print(f"FINAL_RESULT:{json.dumps(final_result)}")
            
            return
        
        # Normal operation
        check_root()
        check_requirements()
        
        # For demonstration, just run compatibility check in integration mode
        if integration_mode or auto_mode:
            print_status("info", "Running in automated mode - performing compatibility demonstration")
            run_compatibility_check()
            
            if get_wireless_interfaces():
                print_status("success", "WiFi interfaces detected - ready for advanced testing")
            else:
                print_status("warning", "No WiFi interfaces detected")
            
            print_status("info", "Advanced testing simulation completed")
            return
        
        # Interactive mode
        print_status("info", "Starting interactive WiFi security testing...")
        
        if enable_monitor_mode():
            networks = scan_networks_advanced(duration=15)
            
            if networks:
                print_status("success", f"Scan completed. Found {len(networks)} networks.")
                print_status("info", "In a real scenario, you would select a target network for testing")
                print_status("warning", "Remember: Only test networks you own or have permission to test")
            else:
                print_status("warning", "No networks found in scan")
        else:
            print_status("error", "Failed to enable monitor mode")
    
    except KeyboardInterrupt:
        print_status("warning", "Script interrupted by user")
    except Exception as e:
        print_status("error", f"Unexpected error: {e}")
    finally:
        cleanup_and_exit()

# Signal handler for clean exit
def signal_handler(sig, frame):
    print_status("warning", "Received interrupt signal")
    cleanup_and_exit()

if __name__ == "__main__":
    # Register signal handler
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    main()
