export default function PostHeader({
    title,
    date,
}: {
    title: string;
    date: string;
}) {
    return (
        <header className="not-prose mb-10 flex flex-col gap-2">
            <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
            <time dateTime={date} className="text-ink-muted text-sm">
                {date}
            </time>
        </header>
    );
}
