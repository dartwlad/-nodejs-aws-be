export class MapperService {
    mapToProduct(product) {
        return {
            id: product.product_id,
            count: product.count,
            price: product.price,
            title: product.title,
            description: product.description,
            image: product.image
        }
    }
}
