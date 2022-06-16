export default[
    {
      path: "/model_list/SRCNN",
      name: "SRCNN",
      component: () => import("../views/modelDesc/SRCNN"),
    },
    {
      path: "/model_list/RealESRGAN",
      name: "RealESRGAN",
      component: () => import("../views/modelDesc/RealESRGAN"),
    },
]