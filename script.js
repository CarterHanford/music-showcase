/*
design by Voicu Apostol.
design: https://dribbble.com/shots/3533847-Mini-Music-Player
I can't find any open music api or mp3 api so i have to download all musics as mp3 file.
You can fork on github: https://github.com/muhammederdem/mini-player
*/

new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Erase Me",
          artist: "Spheres",
          cover: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/img/1.png",
          source: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/music/EraseMe.mp3",
          url: "https://open.spotify.com/track/7dlK7qbrQeDYTCytSbT8yr?si=6TvMxysnR9mBCorlLRRzXA",
          favorited: false
        },
        {
          name: "With You",
          artist: "Spheres",
          cover: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/img/2.png",
          source: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/music/WithYou.mp3",
          url: null,
          favorited: true
        },
        {
          name: "Bring It Back",
          artist: "Spheres",
          cover: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/img/3.png",
          source: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/music/BringItBack.mp3",
          url: "https://open.spotify.com/track/5DHVkBvSXDnoBEEXaKKuw2?si=ZflrSqTaQOmSbZgL5FSjWw",
          favorited: false
        },
        {
          name: "Pray For Me",
          artist: "Spheres",
          cover: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/img/4.png",
          source: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/music/PrayForMe.mp3",
          url: "https://open.spotify.com/track/0AnWwxxTfZKEiTY7015uEX?si=wvfFdCSeR3avD_2jiotWzQ",
          favorited: false
        },
        {
          name: "Bassline",
          artist: "Spheres",
          cover: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/img/5.png",
          source: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/music/Bassline.mp3",
          url: "https://open.spotify.com/track/5v5UBbHQP2Rooa3RTzm1Wv?si=xSK10X0rS3qEhkE-ddPNoQ",
          favorited: true
        },
        {
          name: "Follow You",
          artist: "Spheres",
          cover: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/img/6.png",
          source: "https://raw.githubusercontent.com/carterhanford/music-showcase/master/music/FollowYou.mp3",
          url: "https://open.spotify.com/track/2LY72hQlCze5N9KA0OpGJz?si=aDlr4TEpSyaIG6VE5gFsUQ",
          favorited: false
        },
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});

// Canvas
const canvas = document.querySelector("#canvas-wrapper");

// Scene
const scene = new THREE.Scene();

// Settings 
const fov = 95;
const nearDist = 0.1;
const farDist = 30000;
const sizes = {
	w: window.innerWidth,
	h: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(
	fov,
	sizes.w / sizes.h,
	nearDist,
	farDist
);
camera.position.set(0, 0, Math.round(farDist / 16));
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor("black");
renderer.setSize(sizes.w, sizes.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvas.appendChild(renderer.domElement);

// Custom shader
const uniforms = {
	u_time: { type: "f", value: 1.0 },
	u_resolution: { type: "v2", value: new THREE.Vector2() }
};
const vertexShader = document.querySelector("#vertex").textContent;
const fragmentShader = document.querySelector("#fragment").textContent;
const shaderMaterial = new THREE.ShaderMaterial({
	uniforms,
	vertexShader,
	fragmentShader,
	transparent: true
});

function updateUniforms() {
	uniforms.u_resolution.value.x = renderer.domElement.width;
	uniforms.u_resolution.value.y = renderer.domElement.height;
}
updateUniforms();

// Resizing
window.addEventListener("resize", () => {
	// Update sizes
	sizes.w = window.innerWidth;
	sizes.h = window.innerHeight;

	// Update camera
	camera.aspect = sizes.w / sizes.h;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.w, sizes.h);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	
	updateUniforms();
});

// Particles
const count = 8000;
const particlesPosition = []; // Position in 3d world (x, y, z)

for (let i = 0; i < count; i++) {
	const dist = count * 0.4;

	const x = dist * 2 * Math.random() - dist;
	const y = dist * 2 * Math.random() - dist;
	const z = dist * 2 * Math.random() - dist;

	particlesPosition.push(x, y, z);
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
	"position",
	new THREE.Float32BufferAttribute(particlesPosition, 3)
);

const particlesTexture = new THREE.TextureLoader().load(
	"https://threejs.org/examples/textures/sprites/disc.png"
);
const particlesMaterial = new THREE.PointsMaterial({
	color: "hotpink",
	size: 10,
	sizeAttenuation: true,
	map: particlesTexture,
	// Have the particles without texture outline
	depthTest: false,
	blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Typograpghy
const typoGroup = new THREE.Group();
const typoLoader = new THREE.FontLoader();
const typoSize = Math.max(
	sizes.w < 800 ? 1000 : 1200, 
	Math.round(sizes.w * 0.69)
);
const createTypo = (font) => {
	const word = null;
	const typoProperties = {
		font: font,
		size: typoSize,
		height: 20
	};
	const textMesh = new THREE.Mesh();
	textMesh.geometry = new THREE.TextBufferGeometry(word, typoProperties);
	textMesh.geometry.center();
	textMesh.material = shaderMaterial;
	
	typoGroup.add(textMesh);
};
typoLoader.load(
	"https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
	createTypo
);
scene.add(typoGroup);

// Mouse over/touch effects
let mouseX = 0;
let mouseY = 0;
const mouseFX = {
	moveTypo(cX, cY) {
		mouseX = (cX / sizes.w) * 2 - 1;
		mouseY = -(cY / sizes.h) * 2 + 1;

		const c = 3;
		typoGroup.rotation.x = mouseY * c;
		typoGroup.rotation.y = mouseX * c;
		
		// Respond to these mouse movements and remove initial animation
		typoGroup.matrixAutoUpdate = false;
		typoGroup.updateMatrix();
	},
	moveParticles(cX, cY) {
		const c = 2;
		mouseX = (cX - sizes.w * 0.5) * c;
		mouseY = (cY - sizes.h * 0.5) * c;
	},
	onMouseMove(e) {
		mouseFX.moveTypo(e.clientX, e.clientY);
		mouseFX.moveParticles(e.clientX, e.clientY);
	},
	onTouchMove(e) {
		const touchX = e.changedTouches[0].clientX;
		const touchY = e.changedTouches[0].clientY;
		mouseFX.moveTypo(touchX, touchY);
		mouseFX.moveParticles(touchX, touchY);
	}
};
document.addEventListener("mousemove", mouseFX.onMouseMove);
document.addEventListener("touchmove", mouseFX.onTouchMove);

// Animate & Render
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Time the shader animation
	uniforms.u_time.value = elapsedTime;

	// Animate the particles + typo
	const rotX = Math.sin(elapsedTime * 0.1) * 0.3;
	const rotY = Math.sin(elapsedTime * 0.5) * 0.3;
	particles.rotation.x = rotX;
	particles.rotation.y = rotY;
	// Animate only on start
	typoGroup.rotation.x = rotX;
	typoGroup.rotation.y = rotY;

	// Animate the color
	const cAnim = Math.sin(elapsedTime * 0.25);
	// Based on rgb(49%, 30%, 88%)
	particlesMaterial.color.setRGB(0.29 + cAnim, 0.5 - cAnim, 0.68 + cAnim);

	// Animate camera movements
	const ease = 0.01;
	camera.position.x += (mouseX - camera.position.x) * ease;
	camera.position.y += (mouseY * -1 - camera.position.y) * ease;
	camera.lookAt(scene.position);
	
	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	requestAnimationFrame(tick);
};
tick();

