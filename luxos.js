class LuxOSEmulator {
    constructor(memorySize = 65536) {
        this.memory = new Uint8Array(memorySize);
        this.registers = { A: 0x00, X: 0x00, Y: 0x00, PC: 0x0000, SP: 0xFF, FLAGS: 0x00 };
        this.fileSystem = {};
        this.screenBuffer = [];
        this.commands = {};
        this.initCommands();
        this.installedApps = ["Text Editor", "Spreadsheet", "Fax", "Email"];
    }

    initCommands() {
        this.commands = {
            help: () => "Available commands: help, install, listapps, fax, email, write, read, clear",
            listapps: () => this.installedApps.join("\n"),
            install: (app) => {
                if (this.installedApps.includes(app)) return `${app} is already installed.`;
                return `${app} installation complete.`;
            },
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
            }
        };
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
