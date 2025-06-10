# WiFi Security Guide: Understanding Threats & Protections

## Introduction
WiFi security is crucial for protecting your personal data, privacy, and devices from various network-based attacks. This document explains common WiFi vulnerabilities, attack vectors, and practical steps to secure your wireless networks.

> "Security is not a product, but a process." - Bruce Schneier

## Understanding WiFi Security Threats

### Man-in-the-Middle (MitM) Attacks
In MitM attacks, an attacker positions themselves between you and your connection point, intercepting or altering communications.

**How it works:**
1. Attacker sets up a rogue access point with a similar name to a legitimate network
2. Your device connects to the malicious network, thinking it's legitimate
3. All traffic flows through the attacker's device before reaching its destination
4. The attacker can intercept, modify, or inject data into your communications

**Real-world example:** An attacker in a coffee shop creates a network named "CoffeeShop_WiFi" when the legitimate network is "CoffeeShop-WiFi". Users connecting to the wrong network expose all their unencrypted traffic.

### Packet Sniffing
Packet sniffing involves capturing and analyzing data packets transmitted over a network.

**How it works:**
1. Attacker uses specialized software to capture packets on the network
2. Software decodes the packets, revealing their contents
3. Unencrypted data (HTTP, FTP, etc.) is immediately readable
4. Even encrypted traffic can reveal metadata and patterns

**Protection:** Use HTTPS, VPNs, and avoid public WiFi for sensitive transactions.

### Evil Twin Attacks
A specialized form of MitM attack where the attacker creates an identical copy of a legitimate WiFi network.

**How it works:**
1. Attacker sets up an access point with the exact same SSID as a legitimate network
2. The malicious access point may use a stronger signal to attract connections
3. When users connect, their traffic is routed through the attacker's device
4. The attacker captures login credentials, session cookies, and unencrypted data

**Protection:** Verify network authenticity via the BSSID (MAC address) or use VPN.

### Password Cracking
Attackers attempt to discover WiFi passwords through various methods.

**Common techniques:**
1. **Dictionary attacks** - Testing common passwords and variants
2. **Brute force attacks** - Systematically trying all possible combinations
3. **Rainbow table attacks** - Using pre-computed tables of hash values
4. **WPS PIN attacks** - Exploiting vulnerabilities in WiFi Protected Setup

**Protection:** Use WPA3 when possible, disable WPS, use strong passwords with 12+ characters.

### Deauthentication Attacks
These attacks disconnect users from legitimate networks, potentially forcing them to reconnect to rogue networks.

**How it works:**
1. Attacker sends deauthentication packets to a client or access point
2. These packets appear to come from the legitimate access point
3. Users are disconnected from the network
4. When they reconnect, they might connect to an evil twin network

**Protection:** WPA3 helps protect against these attacks through Protected Management Frames.

## WiFi Encryption Standards

| Standard | Security Level | Vulnerabilities | Recommendation |
|----------|---------------|-----------------|----------------|
| **Open** | None | All traffic can be intercepted | Never use |
| **WEP** | Very Weak | Can be cracked in minutes | Replace immediately |
| **WPA** | Weak | TKIP vulnerabilities, weak password attacks | Upgrade |
| **WPA2** | Moderate | KRACK vulnerability, dictionary attacks | Update firmware |
| **WPA3** | Strong | New standard with few known vulnerabilities | Recommended |

## Best Practices for WiFi Security

1. **Use Strong Encryption**
   - Enable WPA3 if available on your router
   - If WPA3 isn't available, use WPA2-AES/CCMP (not TKIP)
   - Never use WEP or open networks

2. **Create Strong Passwords**
   - Use passwords with 12+ characters
   - Mix uppercase, lowercase, numbers, and symbols
   - Avoid dictionary words, personal information
   - Consider using a passphrase of multiple random words

3. **Secure Your Router**
   - Change default admin credentials immediately
   - Update firmware regularly
   - Disable remote management
   - Use custom DNS servers (e.g., 1.1.1.1, 9.9.9.9)

4. **Network Configuration**
   - Enable MAC address filtering (helpful but not foolproof)
   - Reduce wireless signal strength if coverage extends beyond needed area
   - Create a separate guest network for visitors
   - Disable WPS (WiFi Protected Setup) or use button-only mode

5. **Monitor Connected Devices**
   - Regularly check which devices are connected to your network
   - Investigate unknown devices
   - Consider using a network monitoring tool

6. **Keep Devices Updated**
   - Update all connected device operating systems
   - Update IoT devices which often have weak security
   - Replace devices that no longer receive security updates

## Advanced Protection Techniques

### Network Segmentation
Create separate networks for different device types:
- Primary network for computers and phones
- IoT network for smart home devices
- Guest network for visitors

### VPN Usage
When using public WiFi, always connect through a VPN:
- Encrypts all traffic between your device and the VPN server
- Prevents local network eavesdropping
- Masks your browsing activity from network administrators

### Disable Auto-Connect Features
Configure your devices to:
- Not connect to networks automatically
- Forget public networks after use
- Verify network identity before connecting

## WiFi Vulnerability Detection

Our scanner checks for these critical vulnerabilities:

1. **Weak Encryption**
   - Detection: Network using WEP, WPA (not WPA2/WPA3), or no encryption
   - Risk: Traffic interception, data theft, password cracking
   - Fix: Upgrade router firmware or replace hardware to support WPA2/WPA3

2. **Default Credentials**
   - Detection: Router using factory default username/password
   - Risk: Unauthorized access to router configuration
   - Fix: Change admin credentials to strong, unique password

3. **WPS Vulnerabilities**
   - Detection: WPS enabled with PIN method
   - Risk: PIN brute force attacks allowing network access
   - Fix: Disable WPS or use push-button mode only

4. **Brute Force Vulnerability**
   - Detection: No rate limiting for failed connection attempts
   - Risk: Password cracking through automated tools
   - Fix: Enable intrusion prevention, use WPA3, use very strong passwords

## References
1. [WiFi Alliance Security](https://www.wi-fi.org/discover-wi-fi/security)
2. [NIST Guidelines for Securing Wireless Networks](https://csrc.nist.gov/publications/detail/sp/800-153/final)
3. [OWASP Wireless Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

4. **Disable WPS**
   - WiFi Protected Setup (WPS) can be a security risk. Disable this feature to prevent unauthorized access through brute-force attacks.

5. **Regularly Update Router Firmware**
   - Keep your router's firmware up to date to protect against known vulnerabilities. Check the manufacturer's website for updates regularly.

6. **Enable Network Firewalls**
   - Use built-in firewall features on your router to add an extra layer of security. Consider using additional firewall software on connected devices.

7. **Limit DHCP Leases**
   - Configure your router to limit the number of DHCP leases it can issue. This helps prevent unauthorized devices from connecting to your network.

8. **Use a Guest Network**
   - If you have visitors who need internet access, set up a separate guest network. This keeps your main network secure and limits access to your devices.

9. **Monitor Connected Devices**
   - Regularly check the list of devices connected to your network. Remove any unauthorized devices and change your password if you notice suspicious activity.

10. **Consider Using a VPN**
    - A Virtual Private Network (VPN) can provide an additional layer of security by encrypting your internet traffic, especially when using public WiFi networks.

## Common WiFi Vulnerabilities

1. **Weak Encryption Protocols**
   - Older protocols like WEP are easily compromised. Always use WPA2 or WPA3.

2. **Default Credentials**
   - Many routers come with default usernames and passwords. Change these immediately to prevent unauthorized access.

3. **Unsecured Guest Networks**
   - If guest networks are not properly secured, they can be exploited to gain access to the main network.

4. **Rogue Access Points**
   - Attackers can set up rogue access points that mimic legitimate networks. Always verify the network before connecting.

5. **Man-in-the-Middle Attacks**
   - Attackers can intercept communications between devices on the network. Use encryption and secure protocols to mitigate this risk.

## Conclusion
By following these best practices and being aware of common vulnerabilities, you can significantly enhance the security of your WiFi network. Regularly review your security settings and stay informed about new threats to maintain a secure environment.