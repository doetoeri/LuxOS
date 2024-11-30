class LuxOS {
    constructor() {
        this.disk = {}; // 가상 디스크
        this.allowedExtensions = ['js', 'json', 'html', 'css']; // 허용된 파일 형식
        this.commands = {};
        this.initCommands();
        this.isDiskInserted = false; // HyperDisk 삽입 상태
    }

    initCommands() {
        this.commands = {
            help: () => this.help(),
            ls: () => this.listFiles(),
            read: (fileName) => this.readFile(fileName),
            readmodule: () => this.readModule(),
        };
    }

    // 명령어: readmodule - 파일 업로드 창 열기 및 HyperDisk 읽기 시뮬레이션
    readModule() {
        if (this.isDiskInserted) {
            return "HyperDisk 1.0 is already inserted. Remove it before inserting a new one.";
        }
        this.isDiskInserted = true; // 디스크 삽입
        this.displayMessage("HyperDisk 1.0 inserted. Reading module...");
        setTimeout(() => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = this.allowedExtensions.map((ext) => `.${ext}`).join(',');
            fileInput.style.display = 'none';
            fileInput.onchange = (event) => this.handleFileUpload(event);
            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);
        }, 2000);
        return "Please select a module file to install.";
    }

    // 파일 업로드 처리
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            this.displayMessage("No file selected. HyperDisk 1.0 ejected.");
            this.isDiskInserted = false;
            return;
        }

        const fileExtension = file.name.split('.').pop();
        if (!this.allowedExtensions.includes(fileExtension)) {
            this.displayMessage(`Unsupported file type '.${fileExtension}'. HyperDisk 1.0 ejected.`);
            this.isDiskInserted = false;
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            this.disk[file.name] = reader.result; // 파일 저장
            this.displayMessage(`Module '${file.name}' installed successfully.`);
            if (fileExtension === 'js') {
                this.loadModule(file.name, reader.result); // JavaScript 모듈 로드
            }
            this.isDiskInserted = false; // 디스크 초기화
        };
        reader.readAsText(file);
    }

    // JavaScript 모듈 로드 및 명령어 등록
    loadModule(fileName, content) {
        try {
            const module = new Function(`return ${content}`)(); // 모듈 실행
            if (module.commands) {
                Object.assign(this.commands, module.commands);
                this.displayMessage(`Commands from '${fileName}' have been registered.`);
            }
        } catch (error) {
            this.displayMessage(`Failed to load module '${fileName}': ${error.message}`);
        }
    }

    // 파일 목록 출력
    listFiles() {
        const files = Object.keys(this.disk);
        return files.length ? `Files on HyperDisk:\n${files.join('\n')}` : 'No files found.';
    }

    // 파일 내용 읽기
    readFile(fileName) {
        if (!this.disk[fileName]) return `File '${fileName}' not found.`;
        return `Contents of '${fileName}':\n${this.disk[fileName]}`;
    }

    // 시스템 메시지 출력
    displayMessage(message) {
        const output = document.getElementById('output');
        output.textContent += `${message}\n`;
        output.scrollTop = output.scrollHeight;
    }

    // LuxOS 명령어 목록
    help() {
        return `
LuxOS* 명령어:
- help: 명령어 목록 출력
- ls: 디스크 파일 목록 출력
- read <파일명>: 파일 내용 읽기
- readmodule: HyperDisk 1.0 모듈 읽기 시작
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const luxOS = new LuxOS();
    const inputField = document.getElementById('input');
    const output = document.getElementById('output');

    const execute = () => {
        const command = inputField.value.trim();
        if (command) {
            const result = luxOS.commands[command] ? luxOS.commands[command]() : `Unknown command: ${command}`;
            output.textContent += `> ${command}\n${result}\n`;
            inputField.value = '';
            output.scrollTop = output.scrollHeight;
        }
    };

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') execute();
    });
});
