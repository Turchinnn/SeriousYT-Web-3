// Mock product images data - in a real app this would come from the database
export const getProductImages = (productId: string, category: string) => {
  // Mock image URLs - replace with actual product images
  const mockImages = {
    default: "/placeholder.png",
    black: "/placeholder.png",
    white: "/placeholder.png", 
    gray: "/placeholder.png",
    blue: "/placeholder.png"
  };

  // Return images based on product category and variations
  if (category.toLowerCase().includes("majica") || category.toLowerCase().includes("t-shirt")) {
    return {
      default: mockImages.default,
      variations: {
        "Black": mockImages.black,
        "White": mockImages.white,  
        "Gray": mockImages.gray,
        "Blue": mockImages.blue
      }
    };
  }

  if (category.toLowerCase().includes("kačket") || category.toLowerCase().includes("cap")) {
    return {
      default: mockImages.default,
      variations: {
        "Black": mockImages.black,
        "White": mockImages.white,
        "Gray": mockImages.gray,
        "Blue": mockImages.blue
      }
    };
  }

  if (category.toLowerCase().includes("gaming") || category.toLowerCase().includes("oprema")) {
    return {
      default: mockImages.default,
      variations: {
        "Black": mockImages.black,
        "White": mockImages.white
      }
    };
  }

  // Default fallback
  return {
    default: mockImages.default,
    variations: {
      "Black": mockImages.black,
      "White": mockImages.white,
      "Gray": mockImages.gray,
      "Blue": mockImages.blue
    }
  };
};