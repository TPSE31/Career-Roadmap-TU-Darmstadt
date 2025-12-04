from django.db import models


class Student(models.Model):
    name = models.CharField(max_length=100)
    program = models.CharField(max_length=100)
    semester = models.IntegerField()
    credits_completed = models.IntegerField()

    def str(self):
        return f"{self.name} ({self.program}, Sem {self.semester})"


class Module(models.Model):
    STATUS_CHOICES = [
        ("done", "Abgeschlossen"),
        ("in_progress", "In Bearbeitung"),
        ("open", "Offen"),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="modules")
    name = models.CharField(max_length=100)
    credits = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")

    def str(self):
        return f"{self.name} ({self.credits} CP, {self.status})"