import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import handler from "express-async-handler";

const PORT = 5000;

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

//Connection Info
var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Surendra123$",
  database: "HMS",
  connectionLimit: 10,
});

app.use((req, res, next) => {
  req.db = pool;
  next();
});

//Checks if patient is logged in
app.post(
  "/login",
  handler(async (req, res) => {
    const con = await req.db.getConnection();

    const { email, password } = req.body;
    let sql_statement = `SELECT * FROM Patient WHERE email="${email}" AND password="${password}"`;

    try {
      const [results, fields] = await con.execute(sql_statement);
      if (results.length === 0) {
        res.status(400).send("Username or password is invalid");
      } else {
        const userData = results[0];
        res.send({
          email: userData.email,
          name: userData.name,
          isDoc: false,
        });
        return;
      }
    } catch (err) {
      res
        .status(500)
        .send("Error ocurred while retrieving data. Please try again later");
    } finally {
      con.release();
    }
  })
);

//Checks if doctor is logged in
app.post(
  "/doclogin",
  handler(async (req, res) => {
    const con = await req.db.getConnection();

    const { email, password } = req.body;
    let sql_statement = `SELECT * FROM Doctor WHERE email="${email}" AND password="${password}"`;

    try {
      const [results, fields] = await con.execute(sql_statement);
      if (results.length === 0) {
        res.status(400).send("Username or password is invalid");
      } else {
        const userData = results[0];
        res.send({
          email: userData.email,
          name: userData.name,
          isDoc: true,
        });
        return;
      }
    } catch (err) {
      res
        .status(500)
        .send("Error ocurred while retrieving data. Please try again later");
    } finally {
      con.release();
    }
  })
);

app.post(
  "/registerPatient",
  handler(async (req, res) => {
    const con = await req.db.getConnection();

    let {
      firstName,
      lastName,
      gender,
      conditions,
      surgeries,
      medications,
      address,
      email,
      password,
    } = req.body;

    console.log(firstName);

    if (medications.length === 0) {
      medications = "none";
    }
    if (conditions.length === 0) {
      conditions = "none";
    }
    if (surgeries.length === 0) {
      surgeries = "none";
    }

    let name = firstName + " " + lastName;

    try {
      await con.beginTransaction();

      let check_statement = `SELECT * FROM Patient WHERE email = "${email}"`;
      const [results1] = await con.execute(check_statement);

      if (results1.length > 0) {
        res.status(400).send("Email already exists. Please Login");
        await con.rollback();
        return;
      }

      let insert_patient_statement =
        `INSERT INTO Patient (email, password, name, address, gender) VALUES ` +
        `("${email}", "${password}", "${name}", "${address}", "${gender}")`;

      await con.execute(insert_patient_statement);

      let get_id_statement =
        "SELECT id FROM MedicalHistory ORDER BY id DESC LIMIT 1;";
      const [results3] = await con.execute(get_id_statement);
      let generated_id = results3.length === 0 ? 1 : results3[0].id + 1;

      let insert_medical_history =
        `INSERT INTO MedicalHistory (id, date, conditions, surgeries, medication) VALUES ` +
        `("${generated_id}", curdate(), "${conditions}", "${surgeries}", "${medications}");`;

      await con.execute(insert_medical_history);

      let insert_id_statement =
        `INSERT INTO PatientsFillHistory (patient, history) 
    VALUES ` + `("${email}",${generated_id})`;

      await con.execute(insert_id_statement);
      await con.commit();

      res.send({
        name,
        email,
        isDoc: false,
      });
    } catch (err) {
      res
        .status(500)
        .send("Error ocurred while retrieving data. Please try again later");
      await con.rollback();
    } finally {
      con.release();
    }
  })
);

app.post(
  "/registerDoctor",
  handler(async (req, res) => {
    const con = await req.db.getConnection();

    let { firstName, lastName, gender, scheduleNo, email, password } = req.body;

    let name = firstName + " " + lastName;

    try {
      await con.beginTransaction();

      let check_statement = `SELECT * FROM Doctor WHERE email = "${email}"`;
      const [results1] = await con.execute(check_statement);

      if (results1.length > 0) {
        res.status(400).send("Email already exists. Please Login");
        await con.rollback();
        return;
      }

      let insert_doctor_statement =
        `INSERT INTO Doctor (email, password, name, gender) VALUES ` +
        `("${email}", "${password}", "${name}", "${gender}")`;

      await con.execute(insert_doctor_statement);

      let check_schedule_statement = `SELECT * FROM Schedule WHERE id = "${scheduleNo}";`;
      const [results2] = await con.execute(check_schedule_statement);

      if (results2.length === 0) {
        res.status(400).send("Please enter a valid Schedule No");
        await con.rollback();
        return;
      }

      let insert_schedule_statement =
        `INSERT INTO DocsHaveSchedules (sched, doctor) VALUES ` +
        `(${scheduleNo}, "${email}")`;
      await con.execute(insert_schedule_statement);
      await con.commit();

      res.send({
        name,
        email,
        isDoc: true,
      });
    } catch (err) {
      res
        .status(500)
        .send("Error ocurred while retrieving data. Please try again later");
      await con.rollback();
    } finally {
      con.release();
    }
  })
);

app.post(
  "/changePasswordDoc",
  handler(async (req, res) => {
    let { email, oldPassword, newPassword } = req.body;
    let statement = `UPDATE Doctor SET password = "${newPassword}" WHERE email = "${email}" AND password = "${oldPassword}";`;

    con.query(statement, function (error, results, fields) {
      if (error) {
        res.status(500).send("Error ocurred. Please try again later");
        return;
      } else {
        if (results.changedRows === 0) {
          res
            .status(400)
            .send("Old Password Entered is Incorrect. Please check");
          return;
        }
        res.send({ success: true, message: "Password changed successfully" });
        return;
      }
    });
  })
);

app.post(
  "/changePasswordPatient",
  handler(async (req, res) => {
    let { email, oldPassword, newPassword } = req.body;
    let statement = `UPDATE Patient SET password = "${newPassword}" WHERE email = "${email}" AND password = "${oldPassword}";`;

    con.query(statement, function (error, results, fields) {
      if (error) {
        res.status(500).send("Error ocurred. Please try again later");
        return;
      } else {
        if (results.changedRows === 0) {
          res
            .status(400)
            .send("Old Password Entered is Incorrect. Please check");
          return;
        }
        res.send({ success: true, message: "Password changed successfully" });
        return;
      }
    });
  })
);

//Get medical history of a patient
app.post(
  "/getOneHistory",
  handler(async (req, res) => {
    const con = await req.db.getConnection();

    let { email } = req.body;

    try {
      let query_statement = `SELECT name, email, address, gender, conditions, surgeries, medication 
                            FROM Patient a, MedicalHistory b, PatientsFillHistory c 
                            WHERE a.email = c.patient AND b.id = c.history AND a.email = "${email}"`;
      console.log(email);
      const [results1] = await con.execute(query_statement);

      res.send(results1[0]);
    } catch (err) {
      res
        .status(500)
        .send("Error ocurred while retrieving data. Please try again later");
    } finally {
      con.release();
    }
  })
);

//get info about all the available doctors
app.post(
  "/getDocInfo",
  handler(async (req, res) => {
    const con = await req.db.getConnection();

    try {
      let query_statement = `SELECT name, email
                            FROM Doctor;`;

      const [results] = await con.execute(query_statement);
      res.send(results);
    } catch (err) {
      res
        .status(500)
        .send(
          "Error ocurred while retrieving data of the available Doctors. Please try again later"
        );
    } finally {
      con.release();
    }
  })
);

//GetDiagnosis from apptId
app.get(
  "/getDiagnosis",
  handler(async (req, res) => {
    let id = req.query.apptId;
    const con = await req.db.getConnection();

    try {
      let query_statement = `SELECT appt, Doctor.name, diagnosis, prescription
                            FROM Diagnose, Doctor 
                            WHERE appt = ${id}
                            AND Diagnose.doctor = Doctor.email;`;

      const [results] = await con.execute(query_statement);
      res.send(results[0]);
    } catch (err) {
      res
        .status(500)
        .send(
          "Error ocurred while retrieving data of the previous Diagnosis. Please try again later"
        );
    } finally {
      con.release();
    }
  })
);

//GetDiagnosis from patient email
app.get(
  "/getOneDiagnosis",
  handler(async (req, res) => {
    let email = req.query.patEmail;
    const con = await req.db.getConnection();

    try {
      let query_statement = `SELECT d.name, dia.diagnosis, dia.prescription, a.date, psa.concerns, psa.symptoms
                            FROM Diagnose dia, Doctor d, PatientsAttendAppointments psa, Appointment a 
                            WHERE a.id = dia.appt AND
                            a.id = psa.appt AND
                            dia.doctor = d.email AND
                            a.status = "Done" AND
                            psa.patient = "${email}";`;
      console.log(query_statement);
      const [results] = await con.execute(query_statement);
      res.send(results);
    } catch (err) {
      res
        .status(500)
        .send(
          "Error ocurred while retrieving data of the previous Diagnosis. Please try again later"
        );
    } finally {
      con.release();
    }
  })
);

//Fill Diagnosis
app.post(
  "/fillDiagnosis",
  handler(async (req, res) => {
    const con = await req.db.getConnection();

    let { apptId, diagnosis, prescription } = req.body;

    try {
      await con.beginTransaction();

      let update_diagnosis_statement = `UPDATE Diagnose SET diagnosis="${diagnosis}", prescription="${prescription}" WHERE appt=${apptId};`;
      await con.execute(update_diagnosis_statement);

      let update_appt_status = `UPDATE Appointment SET status="Done" WHERE id=${apptId};`;
      await con.execute(update_appt_status);

      await con.commit();

      res.send({
        success: true,
        message: "Diagnosis successfully updated",
      });
    } catch (err) {
      res
        .status(500)
        .send("Error ocurred while updating diagnosis. Please try again later");
    } finally {
      con.release();
    }
  })
);

//Get appointment list for doctor
app.get(
  "/getApptListDoc",
  handler(async (req, res) => {
    let docEmail = req.query.docEmail;
    console.log(docEmail);
    const con = await req.db.getConnection();

    try {
      let query_statement = `SELECT a.id,a.date, a.starttime, a.endtime, a.status, p.name, psa.concerns, psa.symptoms
      FROM Appointment a, PatientsAttendAppointments psa, Patient p
      WHERE a.id = psa.appt AND psa.patient = p.email
      AND a.id IN (SELECT appt FROM Diagnose WHERE doctor="${docEmail}")`;

      const [results] = await con.execute(query_statement);
      console.log(results);
      res.send(results);
    } catch (err) {
      res
        .status(500)
        .send(
          "Error ocurred while retrieving appointment list. Please try again later"
        );
    } finally {
      con.release();
    }
  })
);

//Get appointment list for patient
app.get(
  "/getApptListPat",
  handler(async (req, res) => {
    let patEmail = req.query.patEmail;
    const con = await req.db.getConnection();

    try {
      let query_statement = `SELECT a.id,a.date, a.starttime, a.endtime, a.status, d.name, psa.concerns, psa.symptoms
      FROM Appointment a, PatientsAttendAppointments psa, Diagnose di, Doctor d
      WHERE a.id = psa.appt AND 
      psa.appt = di.appt AND
      di.doctor = d.email AND
      psa.patient = "${patEmail}";`;

      const [results] = await con.execute(query_statement);
      console.log(results);
      res.send(results);
    } catch (err) {
      res
        .status(500)
        .send(
          "Error ocurred while retrieving appointment list. Please try again later"
        );
    } finally {
      con.release();
    }
  })
);

//Delete Appointment
app.post(
  "/deleteAppt",
  handler(async (req, res) => {
    const con = await req.db.getConnection();

    let { apptId } = req.body;

    try {
      await con.beginTransaction();

      let delete_from_appointment = `DELETE FROM Appointment WHERE id=${apptId};`;
      await con.execute(delete_from_appointment);
      await con.commit();

      res.send({
        success: true,
        message: "Appointment successfully deleted",
      });
    } catch (err) {
      res
        .status(500)
        .send(
          "Error ocurred while deleting the appointment. Please try again later"
        );
    } finally {
      con.release();
    }
  })
);

//Attempt to make an appointment
app.post(
  "/attemptAppt",
  handler(async (req, res) => {
    const con = await req.db.getConnection();
    console.log(req.body);

    let {
      patientEmail,
      docEmail,
      startDate,
      startTime,
      endTime,
      concerns,
      symptoms,
    } = req.body;

    let ndate = new Date(startDate).toLocaleDateString().substring(0, 10);

    let sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
    let sql_start = `CONVERT('${startTime}', TIME)`;
    let sql_end = `CONVERT('${endTime}', TIME)`;

    try {
      await con.beginTransaction();

      let query_for_similar_appt_by_same_person = `SELECT * FROM PatientsAttendAppointments, Appointment  
                                                    WHERE patient = "${patientEmail}" AND
                                                    appt = id AND
                                                    date = ${sql_date} AND
                                                    status = "NotDone"`;

      const [results] = await con.execute(
        query_for_similar_appt_by_same_person
      );
      console.log("1st check done");
      if (results.length > 0) {
        res
          .status(400)
          .send(
            "You already have an appointment today. Please cancel it to make a new appointment"
          );
        await con.rollback();
        return;
      }

      let query_for_doc_other_appointment = `SELECT * FROM Diagnose d INNER JOIN Appointment a 
      ON d.appt=a.id WHERE doctor="${docEmail}" AND date=${sql_date} AND status="NotDone" AND
       ((${sql_start} >= starttime AND ${sql_start} < endtime) OR (${sql_end} > starttime AND ${sql_end} <= endtime))`;

      const [results2] = await con.execute(query_for_doc_other_appointment);
      console.log("2nd check done");
      if (results2.length > 0) {
        res
          .status(400)
          .send(
            "Selected doctor is not available at selected time. Please choose a different doctor or a different time"
          );
        await con.rollback();
        return;
      }

      // (DATE_ADD(breaktime,INTERVAL +1 HOUR) <= breaktime OR ${sql_start} >= DATE_ADD(breaktime,INTERVAL +1 HOUR));`
      let query_for_doc_available = `SELECT doctor, starttime, endtime, breaktime, day 
                                    FROM DocsHaveSchedules 
                                    INNER JOIN Schedule ON DocsHaveSchedules.sched=Schedule.id
                                    WHERE doctor="${docEmail}" AND 
                                    day=DAYNAME(${sql_date}) AND 
                                    NOT(
                                      (${sql_start} < starttime) OR 
                                      (${sql_end} > endtime) OR
                                      (breaktime >= ${sql_start} AND breaktime < ${sql_end}) OR 
                                      (DATE_ADD(breaktime,INTERVAL +1 HOUR) > ${sql_start} AND DATE_ADD(breaktime,INTERVAL +1 HOUR) <= ${sql_end})
                                    );`;
      console.log(query_for_doc_available);
      const [results3] = await con.execute(query_for_doc_available);
      console.log("3rd check done");
      if (results3.length === 0) {
        res
          .status(400)
          .send(
            "Selected doctor is not available at selected time. Please choose a different doctor or a different time"
          );
        await con.rollback();
        return;
      }

      //No clashes Make an appointment

      //get the new id for the apointment to be made
      let get_id_statement =
        "SELECT * FROM Appointment ORDER BY id DESC LIMIT 1;";
      const [results4] = await con.execute(get_id_statement);
      let generated_id = results4.length === 0 ? 1 : results4[0].id + 1;

      let insert_to_appointment_table = `INSERT INTO Appointment (id, date, starttime, endtime, status) 
      VALUES (${generated_id}, ${sql_date}, ${sql_start}, ${sql_end}, "NotDone")`;

      await con.execute(insert_to_appointment_table);
      console.log("1st table done");

      let insert_to_diagnosis_table = `INSERT INTO Diagnose (appt, doctor, diagnosis, prescription) 
      VALUES (${generated_id}, "${docEmail}", "Not Yet Diagnosed" , "Not Yet Diagnosed")`;

      await con.execute(insert_to_diagnosis_table);
      console.log("2nd table done");

      let insert_to_patientAppt_table = `INSERT INTO PatientsAttendAppointments (patient, appt, concerns, symptoms) 
      VALUES ("${patientEmail}", ${generated_id}, "${concerns}", "${symptoms}")`;

      console.log(insert_to_patientAppt_table);
      await con.execute(insert_to_patientAppt_table);
      console.log("3rd table done");
      await con.commit();

      res.send({
        success: true,
        message: "Appointment successfully scheduled!",
      });
    } catch (err) {
      res
        .status(500)
        .send(
          "Error ocurred while scheduling appointment . Please try again later"
        );
      await con.rollback();
    } finally {
      con.release();
    }
  })
);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} `);
});
