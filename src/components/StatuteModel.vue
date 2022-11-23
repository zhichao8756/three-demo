<template>
  <div>
    <div id="loading-text-intro"><p>Loading</p></div>
    <div class="content">
      <div>
        <canvas id="canvas-container" class="webgl" />
      </div>
      <!--      <div>
        <canvas id="canvas-container-details" class="webgl" />
      </div>-->
    </div>
  </div>
</template>
<script setup>
/*eslint-disable*/
import { nextTick, onMounted, reactive, toRefs, onUnmounted } from 'vue'
import { Scene, LoadingManager, WebGLRenderer, sRGBEncoding, Group, PerspectiveCamera, MeshPhongMaterial, DirectionalLight, PointLight, Clock } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useMousePosition  } from '../hoooks/useMousePosition.js'
let renderer
// let renderer2
let scene
let camera
let camera2
let loadingManager
let previousTime = 0
let fillLight
let controls
onMounted(async () => {
  await nextTick()
  initScene()
  loadingManage()
  loadModel()
  tick()
})

// 场景初始化
function initScene () {
// 定义渲染尺寸
  const sizes = {
    width: 1920,
    height: 1080
  }
  // 初始化渲染器
  renderer = new WebGLRenderer({
    canvas: document.querySelector('#canvas-container'),
    antialias: true,
    alpha: true,
    // 提示用户代理怎样的配置更适用于当前的WebGL环境
    powerPreference: 'high-performance'
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 定义渲染器是否在渲染每一帧之前自动清除其输出
  renderer.autoClear = true
  // 定义渲染器的输出编码
  renderer.outputEncoding = sRGBEncoding

  // 初始化渲染器2
  /* renderer2 = new WebGLRenderer({
    canvas: document.querySelector('#canvas-container-details'),
    antialias: false
  })
  renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer2.setSize(sizes.width, sizes.height)
  renderer2.outputEncoding = sRGBEncoding */

  // 初始化场景
  scene = new Scene()
  // 初始化相机1
  const cameraGroup = new Group()
  scene.add(cameraGroup)
  camera = new PerspectiveCamera(35, sizes.width / sizes.height, 1, 100)
  camera.position.set(19, 1.54, -0.1)
  cameraGroup.add(camera)

  // 初始化相机2
  camera2 = new PerspectiveCamera(35, sizes.width / sizes.height, 1, 100)
  camera2.position.set(3.2, 2.8, 3.2)
  camera2.rotation.set(0, 1, 0)
  scene.add(camera2)

  // 直射光
  const directionLight = new DirectionalLight(0xffffff, 0.8)
  directionLight.position.set(-100, 0, -100)
  scene.add(directionLight)

  // 点光源
  fillLight = new PointLight(0x88ffee, 2.7, 10, 3)
  fillLight.position.set(30, 3, 1.8)
  scene.add(fillLight)
}
function initControls () {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
}
// 加载管理
function loadingManage () {
  loadingManager = new LoadingManager()
  loadingManager.onLoad = () => {
    document.querySelector('.content').style.visibility = 'visible'
    const yPosition = { y: 0 }
    // const ftsLoader = document.querySelector('.lds-roller')
    const loadingCover = document.getElementById('loading-text-intro')
    // 隐藏加载页面动画
    new TWEEN.Tween(yPosition)
      .to({ y: 100 }, 900)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
      .onUpdate(() => { loadingCover.style.setProperty('transform', `translate(0, ${yPosition.y}%)`) })
      .onComplete(function () {
        loadingCover.parentNode.removeChild(document.getElementById('loading-text-intro'))
        TWEEN.remove(this)
      })
    // 第一个页面相机添加入场动画
    new TWEEN.Tween(
      camera.position.set(0, 4, 2))
      .to({ x: 0, y: 2.4, z: 5.8 }, 3500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
      .onComplete(function () {
        initControls()
        TWEEN.remove(this)
        // document.querySelector('.header').classList.add('ended')
        // document.querySelector('.description').classList.add('ended')
      })
    // ftsLoader.parentNode.removeChild(ftsLoader)
    window.scroll(0, 0)
  }
}
// 加载模型
function loadModel () {
  // 使用 dracoLoader 加载用blender压缩过的模型
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/')
  dracoLoader.setDecoderConfig({ type: 'js' })
  const loader = new GLTFLoader(loadingManager)
  loader.setDRACOLoader(dracoLoader)

  // 模型加载
  let oldMaterial
  loader.load('./models/statue.glb', function (gltf) {
    gltf.scene.traverse((obj) => {
      if (obj.isMesh) {
        console.log(213333)
        oldMaterial = obj.material
        obj.material = new MeshPhongMaterial({
          shininess: 100
        })
      }
    })
    console.log(gltf.scene)
    scene.add(gltf.scene)
    oldMaterial.dispose()
    renderer.renderLists.dispose()
  })
}
/* const cursor = { x: 0, y: 0 }
document.addEventListener('mousemove', event => {
  event.preventDefault()
  cursor.x = event.clientX / window.innerWidth - 0.5
  cursor.y = event.clientY / window.innerHeight - 0.5
}, false)*/
const { x, y } = useMousePosition()
const clock = new Clock()

function tick () {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime
  const parallaxY = y.value
  const parallaxX = x.value
  // 点光源位置
  fillLight.position.y -= (parallaxY * 9 + fillLight.position.y - 2) * deltaTime
  fillLight.position.x += (parallaxX * 8 - fillLight.position.x) * 2 * deltaTime
  // console.log(fillLight.position.y)
  // 相机组位置
  // cameraGroup.position.z -= (parallaxY / 3 + cameraGroup.position.z) * 2 * deltaTime
  // cameraGroup.position.x += (parallaxX / 3 - cameraGroup.position.x) * 2 * deltaTime
  TWEEN.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
</script>

<style scoped>

</style>
