import React from "react";
import SearchBox from "./SearchBox";
import { useSubjects, type Subject } from "../hooks/useSubjects";
import SelectedCoursesList from "./SelectedCoursesList";
import AvailableCoursesList from "./AvailableCoursesList";
import LoadingDots from "./LoadingDots";
import { useParams } from "next/navigation";

interface SelectedCourse extends Subject {
  selectedCommission: string;
  isPriority: boolean;
}

interface CourseViewProps {
  selectedCourses: SelectedCourse[];
  onCommissionSelect: (course: Subject) => void;
  onAddCourse: (course: Subject, commission: { id: string; name: string }) => void;
  onRemoveCourse: (courseId: string) => void;
  onReorderCourses: (courses: SelectedCourse[]) => void;
}

const CourseView: React.FC<CourseViewProps> = ({ 
  selectedCourses, 
  onCommissionSelect, 
  onAddCourse,
  onRemoveCourse,
  onReorderCourses
}) => {
  const { subjects, loading, error } = useSubjects();
  const { career } = useParams();
  const isExchange = career === 'X';

  // For exchanges, we'll show all subjects in a flat list
  const subjectsByYear = isExchange 
    ? {
        1: {
          year: 'Materias Disponibles',
          subjects: {
            '1': subjects,
            '2': [],
          }
        }
      }
    : subjects.reduce((acc, subject) => {
        const year = subject.year || 0;
        if (!acc[year]) {
          acc[year] = {
            year: year === 0 ? 'ELECTIVAS' : `${year}° Año`,
            subjects: {
              '1': [],
              '2': [],
            }
          };
        }

        // Add subject to appropriate quarter or category
        const quarter = subject.semester?.toString() || '1';
        if (quarter === '1' || quarter === '2') {
          acc[year].subjects[quarter]?.push(subject);
        } else {
           
          if (!acc[year].subjects[subject.section]) {
            acc[year].subjects[subject.section] = [];
          }
          acc[year].subjects[subject.section].push(subject);
        }
        // console.log(acc);
        
        return acc;
      }, {} as Record<number, { 
        year: string; 
        subjects: {
          '1': Subject[];
          '2': Subject[];
          [category: string]: Subject[];
        }
      }>);

  // Sort years (ELECTIVAS at the bottom) - only for non-exchange careers
  const sortedSubjectsByYear = isExchange 
    ? subjectsByYear
    : Object.entries(subjectsByYear)
        .sort(([yearA], [yearB]) => {
          const a = parseInt(yearA);
          const b = parseInt(yearB);
          if (a === 0) return 1;
          if (b === 0) return -1;
          return a - b;
        })
        .reduce((acc, [year, data]) => {
          const displayYear = parseInt(year) === 0 ? 6 : parseInt(year);
          acc[displayYear] = data;
          return acc;
        }, {} as Record<number, typeof subjectsByYear[number]>);

  const handleSubjectSelect = (subject: Subject) => {
    if (selectedCourses.some(c => c.subject_id === subject.subject_id)) {
      onRemoveCourse(subject.subject_id);
      return;
    }

    if (subject.commissions.length === 1) {
      onAddCourse(subject, { 
        id: subject.commissions[0].name,
        name: subject.commissions[0].name 
      });
      return;
    }

    onCommissionSelect(subject);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingDots size="lg" color="bg-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <SearchBox 
        subjects={subjects}
        onSelectSubject={handleSubjectSelect}
      />
      
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:sticky top-4 h-max">
          <SelectedCoursesList 
            courses={selectedCourses}
            onRemove={onRemoveCourse}
            onReorder={onReorderCourses}
          />
        </div>
        <AvailableCoursesList
          courses={sortedSubjectsByYear}
          selectedCourses={selectedCourses}
          onCourseClick={handleSubjectSelect}
          isExchange={isExchange}
        />
      </div>
    </div>
  );
};

export default CourseView;
