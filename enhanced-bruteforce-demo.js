#!/usr/bin/env node
/**
 * Enhanced Brute Force Protection Demo
 * 
 * This script demonstrates the enhanced brute force protection capabilities
 * including common password database and intelligent password generation.
 */

const chalk = require('chalk');
const bruteForceProtection = require('./src/core/brute-force-protection');

/**
 * Creates a visual progress bar for attack timeline
 */
function createProgressBar(totalSeconds, width = 40) {
    const minutes = Math.floor(totalSeconds / 60);
    const progressChar = '█';
    const emptyChar = '░';
    
    if (minutes <= 1) {
        return `[${progressChar.repeat(width)}] ${totalSeconds}s - RAPID CRACK`;
    } else if (minutes <= 5) {
        const filled = Math.floor((5 - minutes) / 5 * width);
        return `[${progressChar.repeat(filled)}${emptyChar.repeat(width - filled)}] ${minutes}m - FAST CRACK`;
    } else if (minutes <= 30) {
        const filled = Math.floor((30 - minutes) / 30 * width);
        return `[${progressChar.repeat(filled)}${emptyChar.repeat(width - filled)}] ${minutes}m - MODERATE`;
    } else {
        return `[${emptyChar.repeat(width)}] ${minutes}m+ - SLOW/SECURE`;
    }
}

/**
 * Display demo header
 */
function displayHeader() {
    console.log(chalk.cyan('╔══════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║        Enhanced Brute Force Protection Demo         ║'));
    console.log(chalk.cyan('╚══════════════════════════════════════════════════════╝'));
    console.log('');
    console.log(chalk.yellow('Educational demonstration of WiFi password security'));
    console.log(chalk.gray('Showing how attackers might attempt to crack passwords'));
    console.log(chalk.red('⚠️  For educational purposes only - use responsibly'));
    console.log('');
}

/**
 * Demonstrates dictionary attack simulation
 */
async function demonstrateDictionaryAttack() {
    console.log(chalk.blue('📚 Dictionary Attack Demonstration'));
    console.log(chalk.gray('─'.repeat(50)));
    
    // Test different scenarios
    const scenarios = [
        {
            name: 'Home Network (Weak)',
            ssid: 'HomeWiFi',
            network: { encryption: 'WPA2' },
            router: { vendor: 'Netgear' }
        },
        {
            name: 'Office Network (Better)',
            ssid: 'CorporateNet',
            network: { encryption: 'WPA3' },
            router: { vendor: 'Cisco' }
        },
        {
            name: 'Generic Router (Poor Security)',
            ssid: 'Linksys',
            network: { encryption: 'WPA' },
            router: { vendor: 'Linksys' }
        }
    ];
    
    for (const scenario of scenarios) {
        console.log(chalk.cyan(`\n🎯 Testing: ${scenario.name}`));
        console.log(`   SSID: ${scenario.ssid}`);
        console.log(`   Encryption: ${scenario.network.encryption}`);
        console.log(`   Router: ${scenario.router.vendor}`);
        
        const results = bruteForceProtection.simulateDictionaryAttack(
            scenario.ssid, 
            scenario.network, 
            scenario.router
        );
        
        console.log(`   📊 Dictionary size: ${chalk.yellow(results.testedPasswords)} passwords`);
        console.log(`   ⏱️  Time to test all: ${chalk.yellow(results.timeToBreak)} seconds`);
        console.log(`   🎯 Potential matches: ${results.potentialMatches.length > 0 ? chalk.red(results.potentialMatches.length) : chalk.green('0')}`);
        
        if (results.potentialMatches.length > 0) {
            console.log(chalk.red('   🚨 PASSWORDS SUCCESSFULLY CRACKED:'));
            results.potentialMatches.slice(0, 3).forEach((match, index) => {
                console.log(chalk.red(`      ${index + 1}. Password: "${match.password}"`));
                console.log(chalk.red(`         Category: ${match.category}`));
                console.log(chalk.red(`         Cracked in: ${match.crackedIn} seconds (${match.attempts} attempts)`));
                console.log(chalk.red(`         Risk: ${match.risk} - ${match.reason}`));
                console.log('');
            });
            
            // Show attack success timeline
            console.log(chalk.magenta('   📈 Attack Timeline:'));
            const sortedCracks = results.potentialMatches.sort((a, b) => a.crackedIn - b.crackedIn);
            sortedCracks.forEach((crack, index) => {
                const timeStr = `${crack.crackedIn}s`;
                console.log(chalk.magenta(`      ${timeStr.padStart(6)} - Password "${crack.password}" CRACKED! (${crack.category})`));
            });
        } else {
            console.log(chalk.green('   ✅ No passwords cracked from dictionary attack'));
        }
        
        // Show password categories tested
        console.log(`   📂 Categories tested:`);
        Object.entries(results.passwordCategories).forEach(([category, count]) => {
            console.log(`      • ${category}: ${count} passwords`);
        });
    }
}

/**
 * Demonstrates intelligent password generation
 */
async function demonstrateIntelligentGeneration() {
    console.log(chalk.blue('\n🧠 Intelligent Password Generation Demonstration'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const testCase = {
        ssid: 'FamilyHome',
        network: { encryption: 'WPA2' },
        router: { vendor: 'ASUS' }
    };
    
    console.log(chalk.cyan(`🎯 Target Network: ${testCase.ssid}`));
    console.log(`   Encryption: ${testCase.network.encryption}`);
    console.log(`   Router: ${testCase.router.vendor}`);
    
    const results = bruteForceProtection.simulateIntelligentPasswordGeneration(
        testCase.ssid,
        testCase.network,
        testCase.router
    );
    
    console.log(`\n📊 Generation Results:`);
    console.log(`   Total generated: ${chalk.yellow(results.generatedPasswords)} passwords`);
    console.log(`   Generation time: ${chalk.yellow(results.timeToGenerate)} seconds`);
    console.log(`   Success rate: ${chalk.yellow(results.estimatedSuccessRate)}%`);
    
    console.log(`\n🔍 Generation Strategies:`);
    results.generationStrategies.forEach(strategy => {
        console.log(chalk.cyan(`   ${strategy.name}:`));
        console.log(`      Generated: ${strategy.count} passwords`);
        console.log(`      Success rate: ${strategy.successRate}%`);
        console.log(`      Examples:`);
        strategy.examples.forEach(example => {
            console.log(`        • ${chalk.gray(example)}`);
        });
    });
    
    // Show successful generated password cracks
    if (results.successfulGeneratedCracks && results.successfulGeneratedCracks.length > 0) {
        console.log(chalk.red('\n🚨 PASSWORDS CRACKED VIA GENERATION:'));
        results.successfulGeneratedCracks.forEach((crack, index) => {
            console.log(chalk.red(`   ${index + 1}. Generated Password: "${crack.password}"`));
            console.log(chalk.red(`      Method: ${crack.method}`));
            console.log(chalk.red(`      Cracked in: ${Math.floor(crack.crackedIn / 60)}:${(crack.crackedIn % 60).toString().padStart(2, '0')} minutes`));
            console.log(chalk.red(`      Attempts: ${crack.attempts.toLocaleString()}`));
            console.log(chalk.red(`      Reason: ${crack.reason}`));
            console.log('');
        });
        
        // Show generation attack timeline
        console.log(chalk.magenta('   📊 Generation Attack Success Timeline:'));
        const totalTime = Math.max(...results.successfulGeneratedCracks.map(c => c.crackedIn));
        const progressBar = createProgressBar(totalTime);
        console.log(chalk.magenta(`      ${progressBar}`));
        
        results.successfulGeneratedCracks.forEach(crack => {
            const minutes = Math.floor(crack.crackedIn / 60);
            const seconds = crack.crackedIn % 60;
            console.log(chalk.magenta(`      ${minutes}:${seconds.toString().padStart(2, '0')} - "${crack.password}" CRACKED!`));
        });
    } else {
        console.log(chalk.green('\n   ✅ No passwords successfully generated and cracked in reasonable time'));
    }
}

/**
 * Demonstrates 16-character password generation
 */
async function demonstrate16CharGeneration() {
    console.log(chalk.blue('\n🔐 16-Character Password Generation'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const ssid = 'HomeNetwork';
    const networkInfo = { encryption: 'WPA2' };
    const routerInfo = { vendor: 'Netgear' };
    
    console.log(chalk.cyan(`Generating 16-character passwords for: ${ssid}`));
    
    // Word combinations
    const wordPasswords = bruteForceProtection.generateWordCombinations(ssid, routerInfo);
    const filtered16Char = wordPasswords.filter(p => p.length === 16);
    
    console.log(`\n📝 Word-based 16-character passwords:`);
    filtered16Char.slice(0, 10).forEach(password => {
        console.log(`   ${chalk.gray(password)} (${password.length} chars)`);
    });
    
    // Pattern-based
    const patternPasswords = bruteForceProtection.generatePatternBasedPasswords(ssid, networkInfo);
    
    console.log(`\n🎨 Pattern-based 16-character passwords:`);
    patternPasswords.slice(0, 10).forEach(password => {
        console.log(`   ${chalk.gray(password)} (${password.length} chars)`);
    });
    
    // Hybrid approach
    const hybridPasswords = bruteForceProtection.generateHybridPasswords(ssid, networkInfo, routerInfo);
    
    console.log(`\n🔄 Hybrid 16-character passwords:`);
    hybridPasswords.slice(0, 10).forEach(password => {
        console.log(`   ${chalk.gray(password)} (${password.length} chars)`);
    });
    
    console.log(`\n📊 Generation Summary:`);
    console.log(`   Word-based: ${wordPasswords.length} total, ${filtered16Char.length} at 16 chars`);
    console.log(`   Pattern-based: ${patternPasswords.length} passwords`);
    console.log(`   Hybrid: ${hybridPasswords.length} passwords`);
}

/**
 * Demonstrates the enhanced assessment
 */
async function demonstrateEnhancedAssessment() {
    console.log(chalk.blue('\n🔬 Enhanced Password Strength Assessment'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const testCases = [
        {
            name: 'Weak Network',
            ssid: 'password',
            network: { encryption: 'WPA2' },
            router: { vendor: 'Generic' }
        },
        {
            name: 'SSID-based Password',
            ssid: 'MyHomeWiFi',
            network: { encryption: 'WPA2' },
            router: { vendor: 'Netgear' }
        },
        {
            name: 'Well-Protected Network',
            ssid: 'SecureCorpNet',
            network: { encryption: 'WPA3' },
            router: { vendor: 'Cisco' }
        }
    ];
    
    for (const testCase of testCases) {
        console.log(chalk.cyan(`\n🧪 Testing: ${testCase.name}`));
        
        const assessment = bruteForceProtection.enhancedPasswordStrengthAssessment(
            testCase.ssid,
            testCase.network,
            testCase.router
        );
        
        console.log(`   Risk Level: ${getRiskColor(assessment.riskLevel)(assessment.riskLevel)}`);
        console.log(`   Crack Time: ${chalk.yellow(assessment.estimatedCrackTime)}`);
        
        console.log(`   Dictionary Attack Results:`);
        console.log(`     • Passwords tested: ${assessment.dictionaryResults.testedPasswords}`);
        console.log(`     • Vulnerabilities found: ${assessment.dictionaryResults.potentialMatches.length}`);
        console.log(`     • Time to complete: ${assessment.dictionaryResults.timeToBreak}s`);
        
        // Show dictionary attack successes
        if (assessment.dictionaryResults.potentialMatches.length > 0) {
            console.log(chalk.red(`     🚨 DICTIONARY ATTACK SUCCESS:`));
            assessment.dictionaryResults.potentialMatches.slice(0, 2).forEach(match => {
                console.log(chalk.red(`       • Cracked: "${match.password}" in ${match.crackedIn}s`));
            });
        } else {
            console.log(chalk.green(`     ✅ No dictionary vulnerabilities`));
        }
        
        console.log(`   Generation Attack Results:`);
        console.log(`     • Passwords generated: ${assessment.generatedPasswordResults.generatedPasswords}`);
        console.log(`     • Success rate: ${assessment.generatedPasswordResults.estimatedSuccessRate}%`);
        
        // Show generation attack successes
        if (assessment.generatedPasswordResults.successfulGeneratedCracks && 
            assessment.generatedPasswordResults.successfulGeneratedCracks.length > 0) {
            console.log(chalk.red(`     🚨 GENERATION ATTACK SUCCESS:`));
            assessment.generatedPasswordResults.successfulGeneratedCracks.slice(0, 1).forEach(crack => {
                const minutes = Math.floor(crack.crackedIn / 60);
                const seconds = crack.crackedIn % 60;
                console.log(chalk.red(`       • Generated & Cracked: "${crack.password}" in ${minutes}:${seconds.toString().padStart(2, '0')}`));
            });
        } else {
            console.log(chalk.green(`     ✅ No generation attack success`));
        }
        
        // Overall attack success summary
        const totalCracks = (assessment.dictionaryResults.potentialMatches?.length || 0) + 
                          (assessment.generatedPasswordResults.successfulGeneratedCracks?.length || 0);
        
        if (totalCracks > 0) {
            console.log(chalk.bgRed.white(`   🔓 NETWORK COMPROMISED: ${totalCracks} password(s) cracked!`));
        } else {
            console.log(chalk.bgGreen.white(`   🔒 NETWORK SECURE: No passwords cracked`));
        };
        
        console.log(`   Top Recommendations:`);
        assessment.recommendations.slice(0, 3).forEach(rec => {
            console.log(`     ${rec}`);
        });
    }
}

/**
 * Gets color for risk level
 */
function getRiskColor(riskLevel) {
    switch (riskLevel) {
        case 'CRITICAL': return chalk.bgRed.white;
        case 'HIGH': return chalk.red;
        case 'MEDIUM': return chalk.yellow;
        case 'LOW': return chalk.green;
        default: return chalk.gray;
    }
}

/**
 * Shows common password statistics
 */
function showPasswordDatabase() {
    console.log(chalk.blue('\n📊 Common Password Database Statistics'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const db = bruteForceProtection.COMMON_WIFI_PASSWORDS;
    
    console.log(`📈 Database Overview:`);
    console.log(`   Top common passwords: ${db.top100.length}`);
    console.log(`   Router vendor defaults: ${Object.keys(db.routerDefaults).length} vendors`);
    console.log(`   SSID-based patterns: ${db.ssidPatterns.length}`);
    console.log(`   Location-based: ${db.locationBased.length}`);
    console.log(`   Date patterns: ${db.datePatterns.length}`);
    console.log(`   Brand names: ${db.brandNames.length}`);
    
    console.log(`\n🏷️  Supported Router Vendors:`);
    Object.keys(db.routerDefaults).forEach(vendor => {
        console.log(`   • ${vendor}: ${db.routerDefaults[vendor].length} default passwords`);
    });
    
    console.log(`\n🔤 Sample Top Passwords (educational purposes):`);
    db.top100.slice(0, 20).forEach((password, index) => {
        console.log(`   ${(index + 1).toString().padStart(2)}: ${chalk.gray(password)}`);
    });
}

/**
 * Demonstrates successful password cracking scenarios
 */
async function demonstrateSuccessfulCracks() {
    console.log(chalk.blue('\n🎯 Password Cracking Success Demonstration'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.yellow('Showing scenarios where passwords would be successfully cracked'));
    console.log('');
    
    const vulnerableScenarios = [
        {
            name: 'SSID-Based Password (Very Common)',
            ssid: 'FamilyWiFi',
            network: { encryption: 'WPA2' },
            router: { vendor: 'Netgear' },
            expectedCrack: 'familywifi123'
        },
        {
            name: 'Router Default Password',
            ssid: 'NETGEAR-5G',
            network: { encryption: 'WPA2' },
            router: { vendor: 'Netgear' },
            expectedCrack: 'password1'
        },
        {
            name: 'Simple Pattern Password',
            ssid: 'HomeNetwork',
            network: { encryption: 'WPA' },
            router: { vendor: 'Linksys' },
            expectedCrack: 'password123'
        }
    ];
    
    for (const scenario of vulnerableScenarios) {
        console.log(chalk.cyan(`🎯 Attacking: ${scenario.name}`));
        console.log(`   Target: ${scenario.ssid} (${scenario.network.encryption})`);
        console.log(`   Router: ${scenario.router.vendor}`);
        
        // Simulate real-time attack
        console.log(chalk.yellow('   🔄 Starting attack simulation...'));
        
        // Dictionary attack
        const dictResults = bruteForceProtection.simulateDictionaryAttack(
            scenario.ssid, 
            scenario.network, 
            scenario.router
        );
        
        if (dictResults.potentialMatches.length > 0) {
            const firstCrack = dictResults.potentialMatches[0];
            console.log(chalk.red(`   💥 ATTACK SUCCESSFUL!`));
            console.log(chalk.red(`   🔓 Password cracked: "${firstCrack.password}"`));
            console.log(chalk.red(`   ⏱️  Time taken: ${firstCrack.crackedIn} seconds`));
            console.log(chalk.red(`   📊 Attempts made: ${firstCrack.attempts.toLocaleString()}`));
            console.log(chalk.red(`   🎯 Attack vector: ${firstCrack.category}`));
            console.log(chalk.red(`   ⚠️  Risk level: ${firstCrack.risk}`));
            
            // Show attack progression
            console.log(chalk.magenta('   📈 Attack Progression:'));
            const progressSteps = Math.min(5, firstCrack.crackedIn);
            for (let i = 1; i <= progressSteps; i++) {
                const percentage = (i / progressSteps * 100).toFixed(1);
                const attemptsSoFar = Math.floor(firstCrack.attempts * i / progressSteps);
                console.log(chalk.magenta(`      Step ${i}: ${percentage}% complete (${attemptsSoFar.toLocaleString()} attempts)`));
            }
            console.log(chalk.red(`      FINAL: PASSWORD FOUND! "${firstCrack.password}"`));
        } else {
            console.log(chalk.green(`   🛡️  Dictionary attack failed - no common passwords found`));
        }
        
        console.log('');
    }
    
    // Show impact of successful crack
    console.log(chalk.bgYellow.black('\n⚡ IMPACT OF SUCCESSFUL PASSWORD CRACK:'));
    console.log('   🔓 Full network access granted');
    console.log('   👥 Can see all connected devices');
    console.log('   📱 Can monitor network traffic');
    console.log('   🌐 Can access router admin panel');
    console.log('   🎭 Can perform man-in-the-middle attacks');
    console.log('   📊 Can steal personal data');
    console.log('   🦠 Can install malware on devices');
    
    console.log(chalk.bgRed.white('\n🚨 TIME TO CRACK COMMON PASSWORDS:'));
    console.log('   • "password": 0.1 seconds');
    console.log('   • "12345678": 0.2 seconds'); 
    console.log('   • "[SSID]123": 1-30 seconds');
    console.log('   • Router defaults: 1-60 seconds');
    console.log('   • Simple patterns: 1-300 seconds');
}

/**
 * Educational security tips
 */
function showSecurityTips() {
    console.log(chalk.blue('\n💡 Password Security Education'));
    console.log(chalk.gray('─'.repeat(50)));
    
    console.log(chalk.green('✅ Strong Password Practices:'));
    console.log('   • Use 16+ characters when possible');
    console.log('   • Mix uppercase, lowercase, numbers, and symbols');
    console.log('   • Avoid dictionary words and personal information');
    console.log('   • Don\'t base passwords on network names (SSID)');
    console.log('   • Use unique passwords for each network');
    console.log('   • Consider using a password manager');
    
    console.log(chalk.red('\n❌ Common Mistakes to Avoid:'));
    console.log('   • Using default router passwords');
    console.log('   • Passwords based on SSID or location');
    console.log('   • Simple substitutions (@ for a, 3 for e)');
    console.log('   • Keyboard patterns (qwerty123, asdf1234)');
    console.log('   • Personal information (birthdays, addresses)');
    console.log('   • Common words with simple modifications');
    
    console.log(chalk.blue('\n🛡️  Network Security Tips:'));
    console.log('   • Use WPA3 encryption if available');
    console.log('   • Enable MAC address filtering');
    console.log('   • Disable WPS (WiFi Protected Setup)');
    console.log('   • Regularly update router firmware');
    console.log('   • Monitor connected devices');
    console.log('   • Set up guest networks for visitors');
}

/**
 * Main demo function
 */
async function runEnhancedBruteForceDemo() {
    displayHeader();
    
    try {
        // Show password database stats
        showPasswordDatabase();
        
        // Demonstrate successful password cracks
        await demonstrateSuccessfulCracks();
        
        // Demonstrate dictionary attacks
        await demonstrateDictionaryAttack();
        
        // Demonstrate intelligent generation
        await demonstrateIntelligentGeneration();
        
        // Demonstrate 16-character generation
        await demonstrate16CharGeneration();
        
        // Show enhanced assessment
        await demonstrateEnhancedAssessment();
        
        // Educational content
        showSecurityTips();
        
        console.log(chalk.green('\n🎉 Enhanced brute force protection demo completed!'));
        console.log(chalk.blue('\nKey Takeaways:'));
        console.log('• Modern password attacks are sophisticated and fast');
        console.log('• Common passwords can be cracked in minutes');
        console.log('• Strong, unique passwords are essential');
        console.log('• WPA3 encryption provides better protection');
        console.log('• Regular security updates are crucial');
        
    } catch (error) {
        console.error(chalk.red('Demo failed:'), error.message);
        console.log(chalk.yellow('\nThis is an educational demonstration.'));
        console.log('Real password cracking requires actual network access and is illegal without permission.');
    }
}

// Run the demo
runEnhancedBruteForceDemo().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
});
