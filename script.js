let lastPlayedAnimation = null;
let currentImage = 1;
let animationInterval = null;

// quick fix
function resetAllFramesVisibility() {
	const allFrames = document.querySelectorAll('.animation-frame');
	allFrames.forEach(frame => {
		frame.classList.remove('visible');
	});
}

function showFrame(prefix, totalFrames, frameNumber) {
	for (let i = 1; i <= totalFrames; i++) {
		const id = `${prefix}${i.toString().padStart(2, '0')}`;
		const el = document.getElementById(id);
		if (el) el.classList.toggle('visible', i === frameNumber);
	}
}

function playAnimation({ prefix = 'intro', totalFrames = 14, frameRate = 40, onComplete = () => {} }) {
	resetAllFramesVisibility();
	
	const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox');
	if (isFirefox) {
		currentImage = totalFrames;
		showFrame(prefix, totalFrames, currentImage);
		lastPlayedAnimation = prefix;
		onComplete();
		return;
	}
	
	currentImage = 1;
	showFrame(prefix, totalFrames, currentImage);
	
	if (animationInterval) clearInterval(animationInterval);
	animationInterval = setInterval(() => {
		currentImage++;
		if (currentImage > totalFrames) {
			clearInterval(animationInterval);
			lastPlayedAnimation = prefix;
			// console.log(`finished animation: ${prefix}`);
			onComplete();
			return;
		}
		showFrame(prefix, totalFrames, currentImage);
	}, frameRate);
}

// function playAnimationReverse({ prefix = 'skills', totalFrames = 14, frameRate = 40, onComplete = () => {} }) {
	// 		resetAllFramesVisibility();

// 		currentImage = totalFrames;
// 		showFrame(prefix, totalFrames, currentImage);

// 		if (animationInterval) clearInterval(animationInterval);
// 		animationInterval = setInterval(() => {
	// 			currentImage--;
// 			if (currentImage < 1) {
// 				clearInterval(animationInterval);
// 				lastPlayedAnimation = prefix;
// 				console.log(`finished animation in reverse: ${prefix}`);
// 				onComplete();
// 				return;
// 			}
// 			showFrame(prefix, totalFrames, currentImage);
// 		}, frameRate);
// }



const imagePaths = [
	...Array.from({length: 16}, (_, i) => `assets/animations/intro/${(i+1).toString().padStart(4, '0')}.webp`),
	// ...Array.from({length: 16}, (_, i) => `assets/animations/skills/${(i+1).toString().padStart(4, '0')}.webp`),
	// ...Array.from({length: 16}, (_, i) => `assets/animations/about/${(i+1).toString().padStart(4, '0')}.webp`),
	// ...Array.from({length: 16}, (_, i) => `assets/animations/contacts/${(i+1).toString().padStart(4, '0')}.webp`)
];

function preloadImages(paths, onProgress, onComplete) {
	let loaded = 0;
	const total = paths.length;
	paths.forEach(path => {
		const img = new Image();
		img.onload = img.onerror = () => {
			loaded++;
			const percent = Math.round((loaded / total) * 100);
			onProgress(percent);
			if (loaded === total) onComplete();
		};
		img.src = path;
	});
}

window.addEventListener('load', () => {
	const loadingPercentage = document.querySelector('.loading-percentage');
	const loadingContainer = document.querySelector('.loading-container');
	
	preloadImages(imagePaths, percent => {
		if (loadingPercentage) loadingPercentage.textContent = `${percent}%`;
	}, () => {
		if (loadingContainer) loadingContainer.style.display = 'none';
		startIntro();
	});
	
	function startIntro() {
		const blurContainer = document.querySelector('.blur-container');
		const mainMenuContainer = document.querySelector('.main-menu');
		
		if (blurContainer) {
			blurContainer.classList.add('un-blurred');
		}
		
		if (mainMenuContainer) {
			mainMenuContainer.style.display = 'flex';
			mainMenuContainer.style.animation = 'menuScaleIn 1s ease-out forwards, menuBlurOut 1s ease-out forwards';      
		}
		
		playAnimation({
			prefix: 'intro',
			totalFrames: 16,
			frameRate: 70,
			onComplete: () => {
				console.log(`starting animation: intro`);
				const introFirstFrame = document.getElementById('intro01');
				const blurContainer = document.querySelector('.blur-container');
				if (introFirstFrame) introFirstFrame.classList.add('visible');
				blurContainer.classList.remove('blur-container-long');
				blurContainer.classList.add('blur-container-short');
			}
		});
	}
});

document.getElementById('button-about').addEventListener('click', () => {
	const audio = new Audio('assets/sound/minecraft_click.mp3');
	audio.play();
	
	const aboutDialog = document.getElementById('about-dialog');
	const blurContainer = document.querySelector('.blur-container');
	
	if (aboutDialog && blurContainer) {
		aboutDialog.style.display = 'flex';
		blurContainer.classList.remove('un-blurred');
		blurContainer.classList.add('blur-active');
	}
});

const aboutDialogCloseBtn = document.querySelector('#about-dialog button');
if (aboutDialogCloseBtn) {
	aboutDialogCloseBtn.addEventListener('click', () => {
		const audio = new Audio('assets/sound/minecraft_click.mp3');
		audio.play();
		
		const aboutDialog = document.getElementById('about-dialog');
		const blurContainer = document.querySelector('.blur-container');
		
		if (aboutDialog && blurContainer) {
			aboutDialog.classList.add('dialog-slide-out');
			
			blurContainer.classList.remove('blur-active');
			blurContainer.classList.add('un-blurred');
			
			aboutDialog.addEventListener('animationend', function handleAnimationEnd() {
				aboutDialog.style.display = 'none';
				aboutDialog.classList.remove('dialog-slide-out');
				aboutDialog.removeEventListener('animationend', handleAnimationEnd);
			});
		}
	});
}

document.getElementById('button-skills').addEventListener('click', () => {
	const audio = new Audio('assets/sound/minecraft_click.mp3');
	audio.play();
	
	const blurContainer = document.querySelector('.blur-container');
	const mainMenuContainer = document.querySelector('.main-menu');
	const skillsDialog = document.getElementById('skills-dialog');
	
	if (blurContainer && mainMenuContainer) {
		skillsDialog.style.display = 'flex';
		blurContainer.classList.remove('un-blurred');
		blurContainer.classList.add('blur-active');
		// mainMenuContainer.style.display = 'none';
	}
});

const skillsDialogCloseBtn = document.querySelector('#skills-dialog button');
if (skillsDialogCloseBtn) {
	skillsDialogCloseBtn.addEventListener('click', () => {
		const audio = new Audio('assets/sound/minecraft_click.mp3');
		audio.play();
		
		const skillsDialog = document.getElementById('skills-dialog');
		const blurContainer = document.querySelector('.blur-container');
		
		if (skillsDialog && blurContainer) {
			skillsDialog.classList.add('dialog-slide-out');
			
			blurContainer.classList.remove('blur-active');
			blurContainer.classList.add('un-blurred');
			
			skillsDialog.addEventListener('animationend', function handleAnimationEnd() {
				skillsDialog.style.display = 'none';
				skillsDialog.classList.remove('dialog-slide-out');
				skillsDialog.removeEventListener('animationend', handleAnimationEnd);
			});
		}
	});
}

document.getElementById('button-projects').addEventListener('click', () => {
	const audio = new Audio('assets/sound/minecraft_click.mp3');
	audio.play();
	
	const blurContainer = document.querySelector('.blur-container');
	const mainMenuContainer = document.querySelector('.main-menu');
	const projectsDialog = document.getElementById('projects-dialog');
	
	if (blurContainer && mainMenuContainer) {
		projectsDialog.style.display = 'flex';
		blurContainer.classList.remove('un-blurred');
		blurContainer.classList.add('blur-active');
		// mainMenuContainer.style.display = 'none';
	}
});

const projectsDialogCloseBtn = document.querySelector('#projects-dialog button');
if (projectsDialogCloseBtn) {
	projectsDialogCloseBtn.addEventListener('click', () => {
		const audio = new Audio('assets/sound/minecraft_click.mp3');
		audio.play();
		
		const projectsDialog = document.getElementById('projects-dialog');
		const blurContainer = document.querySelector('.blur-container');
		
		if (projectsDialog && blurContainer) {
			projectsDialog.classList.add('dialog-slide-out');
			
			blurContainer.classList.remove('blur-active');
			blurContainer.classList.add('un-blurred');
			
			projectsDialog.addEventListener('animationend', function handleAnimationEnd() {
				projectsDialog.style.display = 'none';
				projectsDialog.classList.remove('dialog-slide-out');
				projectsDialog.removeEventListener('animationend', handleAnimationEnd);
			});
		}
	});
}

document.getElementById('button-contacts').addEventListener('click', () => {
	// alert('click');
	const audio = new Audio('assets/sound/minecraft_click.mp3');
	audio.play();
	const blurContainer = document.querySelector('.blur-container');
	const mainMenuContainer = document.querySelector('.main-menu');
	const contactsDialog = document.getElementById('contacts-dialog');
	
	if (blurContainer && mainMenuContainer) {
		contactsDialog.style.display = 'flex';
		blurContainer.classList.remove('un-blurred');
		blurContainer.classList.add('blur-active');
		// mainMenuContainer.style.display = 'none';
	}
});

const contactsDialogCloseBtn = document.querySelector('#contacts-dialog button');
if (contactsDialogCloseBtn) {
	contactsDialogCloseBtn.addEventListener('click', () => {
		const audio = new Audio('assets/sound/minecraft_click.mp3');
		audio.play();
		const contactsDialog = document.getElementById('contacts-dialog');
		const blurContainer = document.querySelector('.blur-container');
		
		if (contactsDialog && blurContainer) {
			contactsDialog.classList.add('dialog-slide-out');
			
			blurContainer.classList.remove('blur-active');
			blurContainer.classList.add('un-blurred');
			
			contactsDialog.addEventListener('animationend', function handleAnimationEnd() {
				contactsDialog.style.display = 'none';
				contactsDialog.classList.remove('dialog-slide-out');
				contactsDialog.removeEventListener('animationend', handleAnimationEnd);
			});
		}
	});
}

const buttonX = document.getElementById('button-x');
buttonX.addEventListener('click', () => {
	const audio = new Audio('assets/sound/minecraft_click.mp3');
	audio.play();
	window.open('https://x.com/', '_blank');
});

const buttonGit = document.getElementById('button-github');
buttonGit.addEventListener('click', () => {
	const audio = new Audio('assets/sound/minecraft_click.mp3');
	audio.play();
	window.open('https://github.com', '_blank');
});

const buttonEmail = document.getElementById('button-email');
buttonEmail.addEventListener('click', () => {
	const audio = new Audio('assets/sound/minecraft_click.mp3');
	audio.play();
	navigator.clipboard.writeText('email@email.com');
});