import {catalogBatchProcess} from './catalogBatchProcess';

jest.mock("aws-sdk", () => ({
    SNS: jest.fn(() => ({
        publish: jest.fn(() => ({
            promise: jest.fn(),
        }))
    })),
}));

const product = {
    count: 1,
    description: "Description",
    price: 10,
    title: "Toy",
    image: "url",
};
const erroredProduct = { ...product, price: "12" };

describe('catalogBatchProcess', () => {
    it("should generate error message if product is not valid", async () => {
        const consoleLogSpy = jest.spyOn(console, "log");

        await catalogBatchProcess({
            Records: [{ body: JSON.stringify(erroredProduct) }],
        });

        expect(consoleLogSpy).toHaveBeenCalledWith('error', 'DB error');
    });

    it("should generate success message if product is valid", async () => {
        const consoleLogSpy = jest.spyOn(console, "log");

        await catalogBatchProcess({
            Records: [{ body: JSON.stringify(product) }],
        });

        expect(consoleLogSpy).toHaveBeenCalledWith('Email send');
    });
});
