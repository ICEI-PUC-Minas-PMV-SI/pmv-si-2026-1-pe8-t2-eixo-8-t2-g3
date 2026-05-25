package controller;

import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/backup")
public class BackupController {

    private static final String DB_FILE = "desejonatural.db";

    @GET
    @Path("/download")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadBackup() {
        File dbFile = new File(DB_FILE);
        if (!dbFile.exists() || !dbFile.isFile()) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("Arquivo do banco de dados nao encontrado")
                .build();
        }

        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String filename = "desejonatural-backup-" + dateStr + ".db";

        return Response.ok(dbFile)
            .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
            .header("Content-Length", String.valueOf(dbFile.length()))
            .build();
    }
}
