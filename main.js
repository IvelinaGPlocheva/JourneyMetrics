import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl'
import gsap from "gsap"

console.log(vertexShader);

import atmospehreVertexShader from './shaders/atmospehreVertex.glsl';
import atmospehreFragmentShader from './shaders/atmospehreFragment.glsl'
console.log(vertexShader);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
)

const renderer = new THREE.WebGL1Renderer({
    antialias: true
})
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

// create spehre 
const spehre = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
        // map: new THREE.TextureLoader().load(
        //     'public/globe.jpg'
        // )
        // color: 0xFF0000
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            globeTexture: {
                value: new THREE.TextureLoader().load('public/globe.jpg')
            }
        }
    })
)
// scene.add(spehre)

//  create atmospehre
const atmospehre = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
        vertexShader: atmospehreVertexShader,
        fragmentShader: atmospehreFragmentShader,
        blending : THREE.AdditiveBlending,
        side: THREE.BackSide
    })
)

atmospehre.scale.set(1.1, 1.1, 1.1)
scene.add(atmospehre)

const group = new THREE.Group()
group.add(spehre)
scene.add(group)

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff
})

const starVertices = []
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000
    const y = (Math.random() - 0.5) * 2000
    const z = -Math.random() * 2000
    starVertices.push(x, y, z)

}

starGeometry.setAttribute('position',
    new THREE.Float32BufferAttribute(
        starVertices, 3)
)
const stars = new THREE.Points(
    starGeometry, starMaterial
)
scene.add(stars)

camera.position.z = 15

const mouse = {
    x: undefined,
    y: undefined
}

function animate() {

    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    spehre.rotation.y += 0.002
    gsap.to(group.rotation, {
        x: -mouse.y * 0.3,
        y: mouse.x * 0.5,
        duration: 2
    })

}

animate()


addEventListener('mousemove', () => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
})