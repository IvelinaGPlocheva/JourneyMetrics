import "/tailwind.css";
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl'
import gsap from "gsap"
const canvasContainer = document.querySelector('#canvasContainer')

import countries from './countries.json';
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'
console.log(countries)
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

renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)

// create sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            globeTexture: {
                value: new THREE.TextureLoader().load('public/globe.jpg')
            }
        }
    })
)

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


function createBox({lat, lng, country, population}) {
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.2, 0.8),
        new THREE.MeshBasicMaterial({
            color: "#3BF7FF",
            opacity: 0.4,
            transparent: true
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

    box.position.x = x
    box.position.y = y
    box.position.z = z

    box.lookAt(0, 0, 0)
    box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4))

    group.add(box)

    gsap.to(box.scale, {
        z: 1.4,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "linear",
        delay: Math.random()
    })

    box.country = country
    box.population = population
}



function createBoxes(countries) {
    countries.forEach(country => {
        console.log(country)

        const lat = country.latlng ? country.latlng[0] : null
        const lng = country.latlng ? country.latlng[1] : null
        const population = country.population

        const box = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.8),
            new THREE.MeshBasicMaterial({
                color: "#3BF7FF",
                opacity: 0.4,
                transparent: true
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

        box.position.x = x
        box.position.y = y
        box.position.z = z

        box.lookAt(0, 0, 0)
        box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4))

        group.add(box)

        gsap.to(box.scale, {
            z: 1.4,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "linear",
            delay: Math.random()
        })

        box.country = country.name
        box.population = new Intl.NumberFormat().format(population)
    })
}

const mouse = {
    x: 0,
    y: 0
}

sphere.rotation.y = -Math.PI / 2


createBoxes(countries)
// Mexico
//negative latitudes are south of the equator.
//negative longitudes are west of the Prime Meridian
// createBox({
//     lat: 23.6345,
//     lng: -102.5528,
//     country: "Mexico",
//     population: "127.6 million"
// })

// // 14.2350° S, 51.9253° W - Brazil
// createBox({
//     lat: -14.2350,
//     lng: -51.9253,
//     country: "Brazil",
//     population: "211 million"
// })

// // 20.5937° N, 78.9629° E - India
// createBox({
//     lat: 20.5937,
//     lng: 78.9629,
//     country: "India",
//     population: "1.366 bill"
// })

// // 35.8617° N, 104.1954° E - China
// createBox({
//     lat: 35.8617,
//     lng: 104.1954,
//     country: "China",
//     population: "1.339 bill"
// })

// // 37.0902° N, 95.7129° W - USA
// createBox({
//     lat: 37.0902,
//     lng: -95.7129,
//     country: "USA",
//     population: "328.3 mill"
// })


const raycaster = new THREE.Raycaster();
const popUpElement = document.querySelector("#popUpElement")
const populationElement = document.querySelector("#populationElement")
const populationElementValue = document.querySelector("#populationElementValue")


function animate() {

    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    group.rotation.y += 0.002

    // if (mouse.x) {
    //     gsap.to(group.rotation, {
    //         x: -mouse.y * 1.5,
    //         y: mouse.x * 1.5,
    //         duration: 2
    //     })
    // }

    // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( group.children.filter(mesh => {
        return mesh.geometry.type === "BoxGeometry"
    }));
    group.children.forEach(mesh => {
        mesh.material.opacity = 0.4
    })

    gsap.set(popUpElement, {
        display: "none"
    })

	for ( let i = 0; i < intersects.length; i ++ ) {

        const box = intersects[i].object

        // apply only on hover of our group
        box.material.opacity = 1
        gsap.set(popUpElement, {
            display: "block"
        })

        // Make the element dynamic
        populationElement.innerHTML = box.country
        populationElementValue.innerHTML = box.population

	}

	renderer.render( scene, camera );


}

animate()


addEventListener('mousemove', (event) => {

    // Normalise mouse coordinates on the screen.
    mouse.x = ((event.clientX - innerWidth / 2) / ( innerWidth / 2 )) * 2 - 1 
    mouse.y = -(event.clientY / innerHeight) * 2 + 1

    gsap.set(popUpElement, {
        x: event.clientX,
        y: event.clientY,
        
    })
})