export const workspaceMotion = {
  fade: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
    },
  },
  slide: {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
    },
  },
  panel: {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.34, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
    },
  },
  stagger: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  },
  cardHover: {
    y: -2,
    transition: { duration: 0.18 },
  },
};
