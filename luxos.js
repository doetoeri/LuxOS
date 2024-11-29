// LuxOS 8-bit Emulator
class LuxOSEmulator {
    constructor(memorySize = 65536) {
        // Initialize 64KB memory
        this.memory = new Uint8Array(memorySize);
        this.registers = {
            A: 0x00,  // Accumulator
            X: 0x00,  // Index Register X
            Y: 0x00,  // Index Register Y
            PC: 0x0000, // Program Counter
            SP: 0xFF,  // Stack Pointer
            FLAGS: 0x00 // Processor Flags
        };
        this.fileSystem = {}; // Simple in-memory file system
        this.screenBuffer = []; // Simulated text-based screen
        this.commands = {}; // Command handler
        this.initCommands();
    }

    // Initialize built-in commands
    initCommands() {
        this.commands = {
            help: () => "Available commands: help, ls, mkdir, write, read, clear",
            ls: () => Object.keys(this.fileSystem).join("\n"),
            mkdir: (name) => {
                if (!name) return "Usage: mkdir <directory_name>";
                if (this.fileSystem[name]) return "Directory already exists.";
                this.fileSystem[name] = {};
                return `Directory '${name}' created.`;
            },
            write: (name, content) => {
                if (!name || !content) return "Usage: write <file_name> <content>";
                this.fileSystem[name] = content;
                return `File '${name}' created with content: "${content}"`;
            },
            read: (name) => this.fileSystem[name] || "File not found.",
            clear: () => {
                this.screenBuffer = [];
                return "Screen cleared.";
            }
        };
    }

    // Run a single command
    executeCommand(input) {
        const [command, ...args] = input.trim().split(" ");
        if (this.commands[command]) {
            return this.commands[command](...args);
        } else {
            return `Unknown command: ${command}`;
        }
    }

    // Render the screen buffer (simulated text mode)
    render() {
        return this.screenBuffer.join("\n");
    }

    // Write to screen buffer
    writeToScreen(line) {
        this.screenBuffer.push(line);
        if (this.screenBuffer.length > 24) this.screenBuffer.shift(); // Keep to 24 lines max
    }

    // Run the OS loop
    start() {
        this.writeToScreen("Welcome to LuxOS 8-bit Emulator");
        this.writeToScreen("Type 'help' for a list of commands.");
        this.renderLoop();
    }

    // Simulated render loop
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

// Initialize the emulator
document.addEventListener("DOMContentLoaded", () => {
    const luxOS = new LuxOSEmulator();
    luxOS.start();
});
