import { vec3, quat, mat4 } from 'gl-matrix';

// 相机内参
const intrinsic = {
  fx: 1905.97,
  fy: 1905.79,
  cx: 1930.25,
  cy: 1082.45,
  width: 3840,
  height: 2160,
};

// 相机外参（从世界坐标到相机坐标）
const extrinsic = {
  tx: 2.1311,
  ty: -0.001381,
  tz: 1.5161,
  qx: 0.495045,
  qy: -0.498663,
  qz: 0.503363,
  qw: -0.502882,
};

/**
 * 将世界坐标系下的3D点投影到图像平面
 * @param {vec3} worldPoint 世界坐标 [x, y, z]
 * @returns {[number, number]} 像素坐标 [u, v]
 */
function projectPoint(worldPoint) {
  // 构建相机位姿矩阵（相机在世界中的变换）
  const rotation = quat.fromValues(extrinsic.qx, extrinsic.qy, extrinsic.qz, extrinsic.qw);
  const translation = vec3.fromValues(extrinsic.tx, extrinsic.ty, extrinsic.tz);

  // 相机世界变换矩阵
  const camWorldMatrix = mat4.fromRotationTranslation(mat4.create(), rotation, translation);

  // 求逆得到世界到相机坐标变换
  const worldToCamMatrix = mat4.invert(mat4.create(), camWorldMatrix);

  // 将点变换到相机坐标系
  const camPoint = vec3.transformMat4(vec3.create(), worldPoint, worldToCamMatrix);

  // 投影到图像平面 (忽略畸变)
  const x = camPoint[0];
  const y = camPoint[1];
  const z = camPoint[2];

  const u = intrinsic.fx * x / z + intrinsic.cx;
  const v = intrinsic.fy * y / z + intrinsic.cy;

  return [u, v];
}
