// The Woodlands Texas Custom Theme
// Inspired by the natural forest environment and modern community aesthetic

export const WoodlandsTheme = {
  // Primary Colors - Forest and Nature Inspired
  colors: {
    // Primary green palette inspired by The Woodlands' forest canopy
    primary: '#2B7F47',        // Deep forest green
    primaryLight: '#4A9B66',   // Lighter forest green
    primaryDark: '#1B5C33',    // Darker forest green
    
    // Secondary colors inspired by natural elements
    secondary: '#8B7355',      // Warm brown (tree bark)
    secondaryLight: '#A68B6B', // Light brown (oak tones)
    secondaryDark: '#6B5842',  // Dark brown (rich earth)
    
    // Accent colors from Visit The Woodlands palette
    accent: '#E8A87C',         // Warm coral (sunset through trees)
    accentTeal: '#5B9AA0',     // Natural teal (lake waters)
    
    // Neutral colors for modern clean aesthetic
    background: '#FAFAF9',     // Warm white (morning mist)
    surface: '#FFFFFF',        // Pure white
    surfaceSecondary: '#F5F5F4', // Light gray (stone paths)
    
    // Text colors
    textPrimary: '#1C1B1A',    // Almost black (deep shadow)
    textSecondary: '#525150',  // Medium gray
    textTertiary: '#78716C',   // Light gray
    textLight: '#FFFFFF',      // White text
    
    // Status colors with natural inspiration
    success: '#16A34A',        // Fresh green (new growth)
    warning: '#D97706',        // Amber (autumn leaves)
    error: '#DC2626',          // Red (cardinal)
    info: '#0EA5E9',           // Sky blue (clear day)
    
    // Functional colors
    border: '#E5E5E4',         // Light border
    shadow: 'rgba(0, 0, 0, 0.1)', // Subtle shadows
  },
  
  // Typography inspired by natural, clean design
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      secondary: 'Georgia, "Times New Roman", serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Spacing based on natural proportions
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  
  // Border radius for organic feel
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  // Shadows for depth
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Component-specific styles
  components: {
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #E5E5E4',
    },
    button: {
      primary: {
        backgroundColor: '#2B7F47',
        color: '#FFFFFF',
        borderRadius: '8px',
        hoverBackgroundColor: '#4A9B66',
      },
      secondary: {
        backgroundColor: '#8B7355',
        color: '#FFFFFF',
        borderRadius: '8px',
        hoverBackgroundColor: '#A68B6B',
      },
    },
    header: {
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E5E5E4',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
  },
};

// Ant Design theme configuration for web - PROPER TOKEN SYSTEM
export const AntDWoodlandsTheme = {
  token: {
    // Seed Token - Primary brand color
    colorPrimary: '#2B7F47',        // Deep forest green
    
    // Map Token - Derived from seed
    colorSuccess: '#16A34A',        // Fresh green
    colorWarning: '#D97706',        // Amber
    colorError: '#DC2626',          // Red
    colorInfo: '#0EA5E9',           // Sky blue
    
    // Alias Token - Semantic colors
    colorBgBase: '#FAFAF9',         // Warm white background
    colorBgContainer: '#FFFFFF',    // Container background
    colorBgLayout: '#FAFAF9',       // Layout background
    colorBgElevated: '#FFFFFF',     // Elevated surface
    
    colorText: '#1C1B1A',           // Primary text
    colorTextSecondary: '#525150',  // Secondary text
    colorTextTertiary: '#78716C',   // Tertiary text
    colorTextQuaternary: '#A8A29E', // Quaternary text
    
    colorBorder: '#E5E5E4',         // Default border
    colorBorderSecondary: '#F5F5F4', // Secondary border
    
    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    fontSizeHeading1: 36,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    
    // Layout
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    borderRadiusXS: 2,
    
    // Control
    controlHeight: 40,
    controlHeightSM: 32,
    controlHeightLG: 48,
    controlHeightXS: 24,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,
    
    // Box shadow
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    boxShadowTertiary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  
  components: {
    Layout: {
      colorBgHeader: '#FFFFFF',
      colorBgBody: '#FAFAF9',
    },
    
    Card: {
      colorBgContainer: '#FFFFFF',
      borderRadiusLG: 12,
      boxShadowTertiary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      colorPrimary: '#2B7F47',
      colorPrimaryHover: '#4A9B66',
      colorPrimaryActive: '#1B5C33',
    },
    
    Segmented: {
      borderRadius: 8,
      colorBgLayout: '#F5F5F4',
      controlHeight: 40,
      controlPaddingHorizontal: 16,
    },
    
    Typography: {
      colorTextHeading: '#1C1B1A',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    
    Tag: {
      borderRadius: 4,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
  },
  
  algorithm: [], // Use default algorithm
};

export default WoodlandsTheme;