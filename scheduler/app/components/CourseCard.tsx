import { CheckIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { type Subject } from "../hooks/useSubjects";

interface CourseCardProps {
  course: Subject;
  isSelected: boolean;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 bg-secondaryBackground 
        rounded-lg group cursor-pointer hover:bg-secondaryBackground/70"
    >
      <span className="text-textDefault">
        ({course.subject_id}) {course.name}
      </span>
      <div>
        {isSelected ? (
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5 text-green-500 block group-hover:hidden" />
            <TrashIcon className="h-5 w-5 text-red-500 hidden group-hover:block" />
          </div>
        ) : (
          <PlusIcon className="h-5 w-5 text-gray group-hover:text-primary" />
        )}
      </div>
    </div>
  );
};

export default CourseCard; 