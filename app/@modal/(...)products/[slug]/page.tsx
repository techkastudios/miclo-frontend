import { Modal } from "@/app/(components)/Modal";
import { ProductDetails } from "@/app/(components)/ProductDetails";

type Params = Promise<{ slug: string }>;

export default async function ProductModal(props: { params: Params }) {
    const { slug } = await props.params;

    return (
        <Modal>
            <ProductDetails slug={slug} />
        </Modal>
    );
}
