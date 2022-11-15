<script setup>
import { nextTick, onMounted } from 'vue'
import { Scene, WebGLRenderer, PerspectiveCamera, MeshLambertMaterial, Mesh, Color, Fog, AmbientLight, SphereGeometry, TorusGeometry, IcosahedronGeometry, MeshToonMaterial, Vector3, Group } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 场景
let theScene
// 星球
let planet
// 环道
let ring
// 卫星
let satellite
// 星星
let stars
// 渲染器
let renderer
// 相机
let camera
// 控制器
let controls
let rot = 0
const axis = new Vector3(0, 0, 1)

onMounted(async () => {
  await nextTick()
  initScene()
  createMesh()
  createTorusGeometry()
  createStars()
  initControls()
  createIcosahedronGeometry()
  tick()
})

// 场景初始化
function initScene () {
  // 定义渲染尺寸
  const sizes = {
    width: 800,
    height: 600
  }
  // 初始化渲染器
  const canvas = document.querySelector('canvas.webgl')
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 初始化场景
  theScene = new Scene()
  theScene.background = new Color(0x1A1A1A)
  theScene.fog = new Fog(0x1A1A1A, 1, 1000)

  // 初始化相机
  camera = new PerspectiveCamera(40, sizes.width / sizes.height)
  camera.position.set(20, 100, 450)
  theScene.add(camera)
  // 添加光源
  const light = new AmbientLight(0xdeedff, 1.5)
  theScene.add(light)
}
// 星球物体建模
function createMesh () {
  const SphereMaterial = new MeshLambertMaterial({
    color: 0x03c03c,
    wireframe: true
  })
  const SphereGeometry_ = new SphereGeometry(80, 32, 32)
  planet = new Mesh(SphereGeometry_, SphereMaterial)
  theScene.add(planet)

  /* mesh = new Mesh(geometry, material)
  theScene.add(mesh) */
}
// 环道建模
function createTorusGeometry () {
  const TorusGeometry_ = new TorusGeometry(150, 8, 2, 120)
  const TorusMaterial = new MeshLambertMaterial({
    color: 0x40a9ff,
    wireframe: true
  })
  ring = new Mesh(TorusGeometry_, TorusMaterial)
  ring.rotation.x = Math.PI / 2
  ring.rotation.y = -0.1 * (Math.PI / 2)
  theScene.add(ring)
}
// 卫星建模
function createIcosahedronGeometry () {
  const IcoGeometry_ = new IcosahedronGeometry(16, 0)
  const IcoMaterial = new MeshToonMaterial({ color: 0xfffc00 })
  satellite = new Mesh(IcoGeometry_, IcoMaterial)
  theScene.add(satellite)
}
// 星星建模
function createStars () {
  stars = new Group()
  for (let i = 0; i < 500; i++) {
    const geometry = new IcosahedronGeometry(Math.random() * 2, 0)
    const material = new MeshToonMaterial({ color: 0xeeeeee })
    const mesh = new Mesh(geometry, material)
    mesh.position.x = (Math.random() - 0.5) * 700
    mesh.position.y = (Math.random() - 0.5) * 700
    mesh.position.z = (Math.random() - 0.5) * 700
    mesh.rotation.x = Math.random() * 2 * Math.PI
    mesh.rotation.y = Math.random() * 2 * Math.PI
    mesh.rotation.z = Math.random() * 2 * Math.PI
    stars.add(mesh)
  }
  theScene.add(stars)
}
// 初始化控制器
function initControls () {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
}

function tick () {
  // 更新渲染器
  // 更新渲染器
  renderer.render(theScene, camera)
  // 给网格模型添加一个转动动画
  rot += Math.random() * 0.8
  const radian = (rot * Math.PI) / 180
  // 星球位置动画
  planet && (planet.rotation.y += 0.005)
  // 星球轨道环位置动画
  ring && ring.rotateOnAxis(axis, Math.PI / 400)
  // 卫星位置动画
  satellite.position.x = 250 * Math.sin(radian)
  satellite.position.y = 100 * Math.cos(radian)
  satellite.position.z = -100 * Math.cos(radian)
  satellite.rotation.x += 0.005
  satellite.rotation.y += 0.005
  satellite.rotation.z -= 0.005
  // 星星动画
  stars.rotation.y += 0.0009
  stars.rotation.z -= 0.0003
  // 更新控制器
  controls.update()
  // 页面重绘时调用自身
  window.requestAnimationFrame(tick)
  // 页面重绘时调用自身
}
</script>

<template>
  <div>
    <canvas class="webgl" />
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
