<template>
  <div>
    <canvas class="webgl" />
  </div>
</template>

<script setup>
/* eslint-disable */
import {nextTick, onMounted} from 'vue'
import * as THREE from 'three'
// import * as dat from 'dat.gui'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
// import {Color} from "three";
// import { useMousePosition  } from '../hoooks/useMousePosition.js'

let renderer
let scene
let camera
// let controls
let astronaut
let t = 0
let particleSystem
let geomParticle
const veticsFloat32ArrayParticles = []
onMounted(async () => {
  await nextTick()
  initScene()
  // createParticlesBySprite()
  // createParticlesByPoints()
  // createParticlesByCanvas()
  createModel()
  createParticles()
  tick()
})
// 场景初始化
function initScene () {
  // 定义渲染尺寸
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  // 初始化渲染器
  const canvas = document.querySelector('canvas.webgl')
  renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 初始化场景
  scene = new THREE.Scene()
  // scene.background = new THREE.TextureLoader().load(new URL('../assets/bg.jpg', import.meta.url).href)
  // 初始化相机
  camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
  camera.position.z = 120
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  scene.add(camera)
  // 镜头控制器
  // controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
}
function tick () {
  updateMesh()
  updateRenderer()
  updateParticles()
  // controls && controls.update();
  // 更新渲染器
  renderer.render(scene, camera)
  // 页面重绘时调用自身
  window.requestAnimationFrame(tick)
  t += 0.01
}
// 创建粒子特效1
const createParticlesBySprite = () => {
  for (let x = -15; x < 15; x++) {
    for (let y = -10; y < 10; y++) {
      const material = new THREE.SpriteMaterial({
        color: Math.random() * 0xffffff
      })
      const sprite = new THREE.Sprite(material)
      sprite.position.set(x * 4, y * 4, 0)
      scene.add(sprite)
    }
  }
}
// 创建粒子特效2
function createParticlesByPoints () {
  const geom = new THREE.BufferGeometry()
  const material = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    color: 0xffffff
  })
  const veticsFloat32Array = []
  const veticsColors = []
  for (let x = -15; x < 15; x++) {
    for (let y = -10; y < 10; y++) {
      veticsFloat32Array.push(x * 4, y * 4, 0)
      const randomColor = new THREE.Color(Math.random() * 0xffffff)
      veticsColors.push(randomColor.r, randomColor.g, randomColor.b)
    }
  }
  const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3)
  const colors = new THREE.Float32BufferAttribute(veticsColors, 3)
  geom.attributes.position = vertices
  geom.attributes.color = colors
  const particles = new THREE.Points(geom, material)
  scene.add(particles)
}
// 使用canvas样式化粒子
function createParticlesByCanvas () {
  // 使用canvas创建纹理
  const createCanvasTexture = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 300
    canvas.height = 300
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.moveTo(170, 120)
    const grd = ctx.createLinearGradient(0, 0, 170, 0)
    grd.addColorStop('0', 'black')
    grd.addColorStop('0.3', 'magenta')
    grd.addColorStop('0.5', 'blue')
    grd.addColorStop('0.6', 'green')
    grd.addColorStop('0.8', 'yellow')
    grd.addColorStop(1, 'red')
    ctx.strokeStyle = grd
    ctx.arc(120, 120, 50, 0, Math.PI * 2)
    ctx.stroke()
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }

  // 创建粒子系统特效3
  const texture = new THREE.TextureLoader().load(new URL('../assets/heart.png', import.meta.url).href)
  const createParticles = (size, transparent, opacity, sizeAttenuation, color) => {
    const geom = new THREE.BufferGeometry()
    const material = new THREE.PointsMaterial({
      size,
      transparent,
      opacity,
      // map: createCanvasTexture(),
      map: texture,
      sizeAttenuation,
      color,
      depthTest: true,
      depthWrite: false
    })
    const veticsFloat32Array = []
    const range = 500
    for (let i = 0; i < 500; i++) {
      const particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2)
      veticsFloat32Array.push(particle.x, particle.y, particle.z)
    }
    const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3)
    geom.attributes.position = vertices
    const particles = new THREE.Points(geom, material)
    scene.add(particles)
  }
  createParticles(40, true, 1, true, 0xffffff)
}
// 创建宇航员模型
function createModel () {
  const loader = new GLTFLoader()
  loader.load('./models/astronaut2.glb', mesh => {
    astronaut = mesh.scene
    astronaut.material = new THREE.MeshLambertMaterial()
    astronaut.scale.set(0.00005, 0.00005, 0.00005)
    astronaut.position.z = 0.08 * Math.sin(t) + (camera.position.z - 0.2)
    scene.add(astronaut)
  })
  // 雾化效果
  scene.fog = new THREE.FogExp2(0x000000, 0.005)
  // 设置光照
  let light = new THREE.PointLight(0xFFFFFF, 0.9)
  light.position.x = -50
  light.position.y = -50
  light.position.z = 75
  scene.add(light)
  light = new THREE.PointLight(0xFFFFFF, 0.9)
  light.position.x = 50
  light.position.y = 50
  light.position.z = 75
  scene.add(light)
  light = new THREE.PointLight(0xFFFFFF, 0.7)
  light.position.x = 25
  light.position.y = 50
  light.position.z = 200
  scene.add(light)
  light = new THREE.AmbientLight(0xFFFFFF, 0.05)
  scene.add(light)
  window.addEventListener('click', onDocumentMouseMove, false)
}
// 宇航员动画
function updateMesh () {
  if (astronaut) {
    // 宇航员由近到远动画
    astronaut.position.z = 0.08 * Math.sin(t) + (camera.position.z - 0.2)
    // 宇航员旋转动画
    astronaut.rotation.x += 0.015
    astronaut.rotation.y += 0.015
    astronaut.rotation.z += 0.01
  }
}
// 创建粒子动画
function createParticles () {
  const texture = new THREE.TextureLoader().load(new URL('../assets/particle.png', import.meta.url).href)
  geomParticle = new THREE.BufferGeometry()
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 10,
    alphaTest: 0.8,
    map: texture
  })
  const veticsColors = []
  for (let p = 0; p < 1000; p++) {
    veticsFloat32ArrayParticles.push(
      rand(20, 30) * Math.cos(p),
      rand(20, 30) * Math.sin(p),
      rand(-1500, 0)
    )
    const randomColor = new THREE.Color(Math.random() * 0xffffff)
    veticsColors.push(randomColor.r, randomColor.g, randomColor.b)
  }
  const vertices = new THREE.Float32BufferAttribute(veticsFloat32ArrayParticles, 3)
  const colors = new THREE.Float32BufferAttribute(veticsColors, 3)
  geomParticle.attributes.position = vertices
  geomParticle.attributes.color = colors
  particleSystem = new THREE.Points(geomParticle, material)
  scene.add(particleSystem)
}
// 粒子动画
function updateParticles () {
  // 粒子系统旋转动画
  particleSystem.position.x = 0.2 * Math.cos(t)
  particleSystem.position.y = 0.2 * Math.cos(t)
  particleSystem.rotation.z += 0.015
  camera.lookAt(particleSystem.position)
  // 粒子系统由近到远动画
  for (let i = 0; i < veticsFloat32ArrayParticles.length; i++) {
    // 如果是Z轴值，则修改数值
    if ((i + 1) % 3 === 0) {
      const dist = veticsFloat32ArrayParticles[i] - camera.position.z
      if (dist >= 0) veticsFloat32ArrayParticles[i] = rand(-1000, -500)
      veticsFloat32ArrayParticles[i] += 2.5
      const _vertices = new THREE.Float32BufferAttribute(veticsFloat32ArrayParticles, 3)
      geomParticle.attributes.position = _vertices
    }
  }
  particleSystem.geometry.verticesNeedUpdate = true
}
// 相机更新
function updateRenderer () {
  const canvas = document.querySelector('canvas.webgl')
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }
}
function rand (min, max) {
  return min + Math.random() * (max - min)
}
// 建立交互
function onDocumentMouseMove (event) {
  const intersects = getIntersects(event.layerX, event.layerY)

  // let intersects = getIntersects()
  if (intersects.length > 0) {
    const res = intersects.filter(function (res) {
      return res && res.object
    })[0]
    if (res && res.object) {
      // console.log(res)
      const selectObject = res.object
      selectObject.material.color.set('#ffc466')
    }
  }
}

function getIntersects (x, y) {
  // const {x, y} = useMousePosition()
  const width = document.querySelector('canvas.webgl').clientWidth
  const height = document.querySelector('canvas.webgl').clientHeight
  const mouse = new THREE.Vector2()
  const rayCaster = new THREE.Raycaster()
  mouse.x = (x / width) * 2 - 1
  mouse.y = -(y / height) * 2 + 1
  // 通过摄像机和鼠标位置更新射线
  rayCaster.setFromCamera(mouse, camera)

  // 返回物体和射线的焦点
  return rayCaster.intersectObject(astronaut)
}

</script>
<style scoped>
.webgl {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
}
</style>
