import { getPage } from "@/lib/api";

async function TermsPage() {
    const result = await getPage("terms-conditions");
    const page = result.ok ? result.data.data : null;

    if (!page) {
        return (
            <section className="mx-auto container px-4 py-16">
                <p className="text-muted-foreground">Page data not found.</p>
            </section>
        );
    }

    return (
        <section className="mx-auto container px-4 py-16">
            <h1 className="text-3xl font-semibold tracking-tight mb-10">{page.title}</h1>
            <div
                className="prose prose-sm sm:prose-base prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-brand max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </section>
    );
}

export default TermsPage;
