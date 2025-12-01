import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, GripVertical, Trash2 } from "lucide-react";

export function CourseEditorPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Course
        </Button>
      </div>

      <Card className="border-dashed border-2 border-primary/50 bg-primary/5">
        <CardHeader className="flex flex-row items-center gap-4">
          <GripVertical className="h-5 w-5 text-muted-foreground cursor-not-allowed" />
          <div className="flex-1">
            <CardTitle>Affiliate Marketing 101: The Blueprint</CardTitle>
            <CardDescription>Drag to reorder courses</CardDescription>
          </div>
          <Button variant="ghost" size="icon" disabled>
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pl-12">
            {/* Module 1 */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-not-allowed" />
                    <div className="flex-1">
                        <p className="font-semibold">Module 1: The Basics</p>
                        <p className="text-sm text-muted-foreground">Drag to reorder modules</p>
                    </div>
                     <Button variant="ghost" size="icon" disabled>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                 <CardContent className="space-y-2 p-4 pt-0 pl-12">
                    {/* Topic 1 */}
                     <Card className="bg-background">
                        <CardHeader className="flex flex-row items-center gap-4 p-3">
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-not-allowed" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Introduction to Affiliate Marketing</p>
                            </div>
                            <Button variant="ghost" size="icon" disabled>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                     </Card>
                     {/* Topic 2 */}
                      <Card className="bg-background">
                        <CardHeader className="flex flex-row items-center gap-4 p-3">
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-not-allowed" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Finding Your Niche</p>
                            </div>
                            <Button variant="ghost" size="icon" disabled>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                     </Card>
                     <Button variant="outline" size="sm" className="w-full border-dashed" disabled>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Topic
                     </Button>
                 </CardContent>
            </Card>

            <Button variant="secondary" size="sm" className="w-full border-dashed" disabled>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Module
            </Button>
        </CardContent>
        <CardFooter className="pl-12">
            <p className="text-sm text-muted-foreground">This is a placeholder for the graphical course editor. Drag and drop functionality is not implemented.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
