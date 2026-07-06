import {
  fadeVariants,
  slideUpVariants,
  scaleVariants,
  drawerVariants,
  modalVariants,
  panelVariants,
  pageVariants,
  staggerContainer,
} from "@/theme/motion"

export const motionPresets = {
  fade: fadeVariants,
  slide: slideUpVariants,
  scale: scaleVariants,
  stagger: staggerContainer,
  hover: {
    whileHover: { y: -2 },
    whileTap: { y: 0 },
  },
  page: pageVariants,
  drawer: drawerVariants,
  modal: modalVariants,
  panel: panelVariants,
} as const
