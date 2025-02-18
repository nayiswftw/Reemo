import CreateTaskDialog from "@/components/workspace/task/create-task-dialog";
import TaskTable from "@/components/workspace/task/task-table";

export default function Tasks() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            All Tasks
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Here&apos;s the list of tasks for this workspace!
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <CreateTaskDialog />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <TaskTable />
        </div>
      </div>
    </div>
  );
}
