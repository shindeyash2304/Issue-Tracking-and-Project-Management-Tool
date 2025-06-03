import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/pro-solid-svg-icons/faChevronLeft";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons/faChevronRight";
import { faCalendar } from "@fortawesome/pro-solid-svg-icons/faCalendar";
import { useState } from "react";
import { addMonths, format, getDay, parse, startOfWeek, subMonths } from "date-fns";

import { Task } from "@/features/tasks/types";
import { TaskStatus } from "@/features/tasks/schema";

import { EventCard } from "@/features/tasks/components/event-card";
import { Button } from "@/components/ui/button";

import "./data-calendar.css"
import 'react-big-calendar/lib/css/react-big-calendar.css';


const locales = {
  "en-US": enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

function CustomToolbar({ date, onNavigate }: { date: Date, onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void }) {
  return (
    <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button onClick={() => onNavigate("PREV")} variant={'secondary'} size={'icon'} className="flex items-center">
        <FontAwesomeIcon icon={faChevronLeft} className="size-4" />
      </Button>
      <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
        <FontAwesomeIcon icon={faCalendar} className="size-4 mr-2" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button onClick={() => onNavigate("NEXT")} variant={'secondary'} size={'icon'} className="flex items-center">
        <FontAwesomeIcon icon={faChevronRight} className="size-4" />
      </Button>
    </div>
  )
}

export default function DataCalendar({ tasks }: { tasks: Task[] }) {
  const [value, setValue] = useState(tasks.length > 0 ? new Date(tasks[0].dueDate) : new Date());

  const events = tasks.map(task => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    id: task.id,
    status: task.taskStatus
  }));

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    }
  };


  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      toolbar={true}
      showAllEvents={true}
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) => localizer?.format(date, "EEE", culture) || ""
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard id={event.id} status={event.status as TaskStatus} title={event.title} assignee={event.assignee!} project={event.project!} />
        ),
        toolbar: () => <CustomToolbar date={value} onNavigate={handleNavigate} />,
      }}
    />
  )
}
