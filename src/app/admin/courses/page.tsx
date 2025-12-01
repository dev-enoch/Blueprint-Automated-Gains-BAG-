import { CourseEditorPlaceholder } from "./_components/CourseEditorPlaceholder";

export default function AdminCoursesPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Editor</h1>
            <p className="text-muted-foreground">
                Create, edit, reorder, and delete courses, modules, and topics.
            </p>
            <div className="mt-6">
                <CourseEditorPlaceholder />
            </div>
        </div>
    );
}
