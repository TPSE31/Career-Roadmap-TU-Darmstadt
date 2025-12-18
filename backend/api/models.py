from django.db import models


class Student(models.Model):
    name = models.CharField(max_length=100)
    program = models.CharField(max_length=100)
    semester = models.IntegerField()
    credits_completed = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.program}, Sem {self.semester})"


class Module(models.Model):

    name = models.CharField(max_length=100)
    credits = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.credits} CP)"


class ModuleProgress(models.Model):

    STATUS_CHOICES = [
        ("done", "Abgeschlossen"),
        ("in_progress", "In Bearbeitung"),
        ("open", "Offen"),
    ]

    student = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE,  
        related_name="module_progress"
    )
    
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name="student_progress"
    )

    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default="open"
    )

    class Meta:
        unique_together = ("student", "module")

    def __str__(self):
        return f"{self.student.name} – {self.module.name} ({self.status})"