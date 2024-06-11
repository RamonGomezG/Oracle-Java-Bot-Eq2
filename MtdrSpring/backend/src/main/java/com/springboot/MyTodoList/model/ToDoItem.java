package com.springboot.MyTodoList.model;


import javax.persistence.*;
import java.time.OffsetDateTime;

/*
    representation of the TODOITEM table that exists already
    in the autonomous database
 */
@Entity
@Table(name = "TODOITEM")
public class ToDoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int ID;
    @Column(name = "DESCRIPTION") //Titulo
    String description;
    @Column(name = "DETAILS") //Descripcion
    String details;
    @Column(name = "PRIORITY") //Prioridad
    int priority;
    @Column(name = "COMPLEXITY") //Complejidad
    int complexity;
    @Column(name = "CREATION_TS")
    OffsetDateTime creation_ts;
    @Column(name = "done")
    boolean done;
    @Column(name = "IDASSIGNEE")
    String idAssignee;
    @Column (name = "IDEPIC")
    int idEpic; 
    @Column (name = "IDSPRINT")
    int idSprint;
    @Column (name = "IDPROJECT")
    int idProject;  



    public ToDoItem(){

    }

    public ToDoItem(int ID, String description, String details, int priority, int complexity, OffsetDateTime creation_ts, boolean done, String idAssignee, int idEpic, int idSprint, int idProject) {
        this.ID = ID;
        this.description = description;
        this.details = details;
        this.priority = priority;
        this.creation_ts = creation_ts;
        this.done = done;
        this.idAssignee = idAssignee;
        this.idEpic = idEpic;
        this.idSprint = idSprint; 
        this.idProject = idProject; 
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public int getComplexity() {
        return complexity;
    }

    public void setComplexity(int complexity) {
        this.complexity = complexity;
    }

    public OffsetDateTime getCreation_ts() {
        return creation_ts;
    }

    public void setCreation_ts(OffsetDateTime creation_ts) {
        this.creation_ts = creation_ts;
    }

    public boolean isDone() {
        return done;
    }
    
    public void setIdAssignee(String idAssignee){
        this.idAssignee = idAssignee;
    }

    public String getIdAssignee() {
        return idAssignee;
    }
    
    public void setDone(boolean done) {
        this.done = done;
    }

    public void setEpic(int idEpic) {
        this.idEpic = idEpic; 
    }

    public void setSprint(int idSprint) {
        this.idSprint = idSprint;
    }

    public void setProject(int idProject) {
        this.idProject = idProject;
    }

    public int getEpic() {
        return this.idEpic;
    }

    public int getSprint() {
        return this.idSprint;
    }

    public int getProject() {
        return this.idProject;
    }

    @Override
    public String toString() {
        return "ToDoItem{" +
                "ID=" + ID +
                ", description='" + description + '\'' +
                ", details='" + details + '\'' +
                ", priority=" + priority +
                ", complexity=" + complexity +
                ", creation_ts=" + creation_ts +
                ", done=" + done +
                ", IDASSIGNEE=" + idAssignee +
                ", idEpic=" + idEpic +
                ", idSprint=" + idSprint + 
                ", idProject=" + idProject +
                '}';
    }
}
