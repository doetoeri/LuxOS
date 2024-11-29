class LuxOSEmulator {
    constructor(memorySize = 65536) {
        this.memory = new Uint8Array(memorySize);
        this.registers = { A: 0x00, X: 0x00, Y: 0x00, PC: 0x0000, SP: 0xFF, FLAGS: 0x00 };
        this.fileSystem = {};
        this.screenBuffer = [];
        this.commands = {};
        this.installedApps = []; // 앱 설치 상태를 저장
        this.availableApps = {
            LuxText: { description: "Text Editor for LuxOS", extension: ".luxd" },
            LuxSheet: { description: "Spreadsheet for LuxOS", extension: ".luxs" },
            LuxFax: { description: "Fax application for LuxOS" },
            LuxMail: { description: "Email application for LuxOS" },
        };
        this.initCommands();
    }

    initCommands() {
        this.commands = {
            help: () =>
                `Available commands: help, install <app_name>, listapps, fax, email, write <file> <content>, read <file>, clear`,
            listapps: () => this.installedApps.join("\n") || "No apps installed.",
            install: (appName) => this.installApp(appName),
            write: (name, content) => {
                if (!name || !content) return "Usage: write <file_name> <content>";
                this.fileSystem[name] = content;
                return `File '${name}' created with content: "${content}"`;
            },
            read: (name) => this.fileSystem[name] || "File not found.",
            fax: (number, message) => {
                if (!number || !message) return "Usage: fax <number> <message>";
                return `Fax sent to ${number} with message: "${message}"`;
            },
            email: (address, subject, body) => {
                if (!address || !subject || !body) return "Usage: email <address> <subject> <body>";
                return `Email sent to ${address}\nSubject: ${subject}\nBody: ${body}`;
            },
            clear: () => {
                this.screenBuffer = [];
                return "Screen cleared.";
            },
        };
    }

    installApp(appName) {
        if (!appName) return "Usage: install <app_name>";
        if (!this.availableApps[appName]) return `Unknown app: ${appName}`;
        if (this.installedApps.includes(appName)) return `${appName} is already installed.`;

        this.writeToScreen(`Installing ${appName}...`);
        setTimeout(() => {
            this.installedApps.push(appName);
            this.writeToScreen(`${appName} installation complete.`);
            this.render();
        }, 2000); // 설치 진행 효과를 위해 2초 딜레이
        return `Starting installation for ${appName}...`;
    }

    executeCommand(input) {
        const [command, ...args] = input.trim().split(" ");
        if (this.commands[command]) return this.commands[command](...args);
        return `Unknown command: ${command}`;
    }

    render() {
        return this.screenBuffer.join("\n");
    }

    writeToScreen(line) {
        this.screenBuffer.push(line);
        if (this.screenBuffer.length > 24) this.screenBuffer.shift();
    }

    start() {
        this.writeToScreen("Welcome to LuxOS 8-bit Emulator");
        this.writeToScreen("Type 'help' for a list of commands.");
        this.renderLoop();
    }

    renderLoop() {
        const screen = document.getElementById("screen");
        const input = document.getElementById("input");

        const renderScreen = () => {
            screen.textContent = this.render();
        };

        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const command = input.value;
                input.value = "";
                const output = this.executeCommand(command);
                this.writeToScreen(`> ${command}`);
                this.writeToScreen(output);
                renderScreen();
            }
        });

        renderScreen();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const luxOS = new LuxOSEmulator();
    luxOS.start();
});
