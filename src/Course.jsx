export const Course = ({ course }) => {
  return (
    <>
      <h1>Web development curriculum</h1>
      {course &&
        course.map((courses) => {
          const sumExercises = courses.parts.reduce((acc, parts) => {
            return acc + parts.exercises;
          }, 0);
          return (
            <div key={courses.id}>
              <h2>{courses.name}</h2>
              {courses.parts.map((part) => {
                return (
                  <p key={part.id}>
                    {part.name} {part.exercises}
                  </p>
                );
              })}

              <p>
                <b>Total of {sumExercises} exercises </b>
              </p>
            </div>
          );
        })}
    </>
  );
};
