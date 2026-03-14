{
  "task": "add_scroll_velocity_hospital_brands_section",
  "framework": "React / Next.js",
  "animation_library": "motion/react",
  "component_name": "ScrollVelocity",
  "design_source": "Figma (vibecoding export)",
  "page_target": "homepage",
  "section_position": "middle_section",

  "section_name": "HospitalPartners",

  "goal": "Create a scrolling brand marquee showing well-known hospital names to increase trust and credibility on the homepage",

  "layout": {
    "container": {
      "width": "100%",
      "padding_top": "80px",
      "padding_bottom": "80px",
      "text_align": "center"
    },
    "background": {
      "type": "transparent_or_soft_gradient"
    }
  },

  "section_header": {
    "title": "Dipercaya Oleh Rumah Sakit Ternama",
    "subtitle": "Platform pendamping pasien yang siap membantu keluarga Anda di berbagai rumah sakit terpercaya"
  },

  "scroll_velocity_component": {
    "texts": [
      "SILOAM HOSPITAL",
      "RS HARAPAN ANDA",
      "RS HARAPAN BUNDA",
      "KLINIK MEDIKA",
      "RS MITRA KELUARGA",
      "RS MAYAPADA",
      "RS PREMIER",
      "RS MEDISTRA",
      "RS OMNI",
      "RS HERMINA"
    ],

    "velocity": 120,

    "damping": 50,
    "stiffness": 400,

    "numCopies": 6,

    "velocityMapping": {
      "input": [0, 1000],
      "output": [0, 5]
    }
  },

  "styling": {
    "text_size_desktop": "text-[4rem]",
    "text_size_mobile": "text-[2rem]",
    "font_weight": "font-bold",
    "text_color": "text-slate-300",
    "opacity": "opacity-70",
    "letter_spacing": "tracking-tight"
  },

  "parallax_settings": {
    "parallaxClassName": "overflow-hidden w-full",
    "scrollerClassName": "flex whitespace-nowrap gap-10 justify-center"
  },

  "responsive_rules": {
    "desktop": {
      "velocity": 120,
      "text_size": "4rem"
    },
    "tablet": {
      "velocity": 90,
      "text_size": "3rem"
    },
    "mobile": {
      "velocity": 60,
      "text_size": "2rem"
    }
  },

  "performance": {
    "reduce_motion_if_user_prefers": true,
    "limit_fps": 60
  },

  "integration_rules": [
    "Place section in the middle of homepage between hero section and service features",
    "Do not modify existing layout spacing from Figma",
    "Ensure animation does not overlap interactive components",
    "Keep animation as decorative trust indicator"
  ]
}