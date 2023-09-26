import "/tailwind.css";
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl'
import gsap from "gsap"
const canvasContainer = document.querySelector('#canvasContainer')

// console.log(vertexShader);

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'
// console.log(vertexShader);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.offsetWidth / canvasContainer.offsetHeight,
    0.1,
    1000
)

const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    canvas: document.querySelector('canvas')
})

// console.log(canvasContainer)

renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)
// document.body.appendChild(renderer.domElement)

// create sphere
const sphere = new THREE.Mesh(
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
// scene.add(sphere)

//  create atmosphere
const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending : THREE.AdditiveBlending,
        side: THREE.BackSide
    })
)

atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
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


function createPoint(lat, lng) {
    const point = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.8),
        new THREE.MeshBasicMaterial({
            color: 0xFF0000
        })
    )

    // 23.6345° N, 102.5528° W - Mexico
    // JS Math si and cos works only with radiants not degrees.
    const latitude = (lat / 180) * Math.PI
    const longitude = (lng / 180) * Math.PI
    const radius = 5

    // Formulas for getting point location on a sphere.
    const x = radius * Math.cos(latitude) * Math.sin(longitude)
    const y = radius * Math.sin(latitude)
    const z = radius * Math.cos(latitude) * Math.cos(longitude)

    point.position.x = x
    point.position.y = y
    point.position.z = z

    point.lookAt(0, 0, 0)
    point.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4))

    group.add(point)
}

const mouse = {
    x: 0,
    y: 0
}

sphere.rotation.y = -Math.PI / 2

// Mexico
//negative latitudes are south of the equator.
//negative longitudes are west of the Prime Meridian
createPoint(23.6345, -102.5528)

// 14.2350° S, 51.9253° W - Brazil
createPoint(-14.2350, -51.9253)

// 20.5937° N, 78.9629° E - India
createPoint(20.5937, 78.9629)

// 35.8617° N, 104.1954° E - China
createPoint(35.8617, 104.1954)

// 37.0902° N, 95.7129° W - USA
createPoint(37.0902, -95.7129)

function animate() {

    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    // sphere.rotation.y += 0.002

    if (mouse.x) {
        gsap.to(group.rotation, {
            x: -mouse.y * 1.5,
            y: mouse.x * 1.5,
            duration: 2
        })
    }
}

animate()


addEventListener('mousemove', () => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
})