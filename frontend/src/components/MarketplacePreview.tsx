import { Button } from "./ui/button";

const MarketplacePreview = () => {
  const products = [
    {
      name: "Organic Tomatoes",
      origin: "Green Valley Farm",
      price: "$4.99/lb",
      quantity: "500 lbs available",
      image: "🍅"
    },
    {
      name: "Fresh Lettuce",
      origin: "Sunrise Agricultural",
      price: "$2.49/head",
      quantity: "200 heads available",
      image: "🥬"
    },
    {
      name: "Sweet Corn",
      origin: "Harvest Moon Farm",
      price: "$3.99/dozen",
      quantity: "150 dozen available",
      image: "🌽"
    },
    {
      name: "Farm Potatoes",
      origin: "Golden Fields Co.",
      price: "$1.99/lb",
      quantity: "1000 lbs available",
      image: "🥔"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Fresh Produce Marketplace
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover fresh, verified produce directly from local farmers
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
          {products.map((product, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="text-6xl text-center mb-4">{product.image}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-green-600 font-medium mb-1">
                  {product.origin}
                </p>
                <p className="text-2xl font-bold text-amber-600 mb-2">
                  {product.price}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {product.quantity}
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg rounded-full"
          >
            View Full Marketplace
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreview;