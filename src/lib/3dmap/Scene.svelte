<script>
	import { OrbitControls, Gizmo } from '@threlte/extras';

	import { T } from '@threlte/core';
</script>

<T.PerspectiveCamera makeDefault position={[10, 5, 10]} lookAt.y={0.5}>
	<OrbitControls enableDamping maxPolarAngle={1.5} />
</T.PerspectiveCamera>
<Gizmo horizontalPlacement="left" paddingX={20} paddingY={20} />

<T.DirectionalLight position.y={10} position.z={10} castShadow />
<T.AmbientLight intensity={0.3} />
<T.GridHelper args={[10, 10]} />

<T.Mesh position.y={0} castShadow>
	<T.BoxGeometry args={[1, 2, 1]}></T.BoxGeometry>
</T.Mesh>

<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
	<T.CircleGeometry args={[4, 40]} />
	<T.MeshStandardMaterial color="white" />
</T.Mesh>
