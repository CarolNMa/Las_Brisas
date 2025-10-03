package com.brisas.las_brisas.service.contract;

import com.brisas.las_brisas.model.contract.contract;
import com.brisas.las_brisas.model.employee.employee;

import com.brisas.las_brisas.repository.contract.Icontract;
import com.brisas.las_brisas.repository.employee.Iemployee;
import com.brisas.las_brisas.repository.employee.Iemployee_area;
import com.brisas.las_brisas.repository.position.Iemployee_post;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final Iemployee iEmployee;
    private final Icontract iContract;
    private final Iemployee_post iEmpleadoCargo;
    private final Iemployee_area iEmpleadoArea;

    public byte[] generateCertificate(int employeeId) throws Exception {
        employee emp = iEmployee.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        contract cont = iContract.findTopByEmployee_IdOrderByIdDesc(employeeId)
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado"));

        String cargo = iEmpleadoCargo.findTopByEmployee_IdOrderByIdDesc(employeeId)
                .map(ec -> ec.getPost().getNamePost())
                .orElse("Cargo no definido");

        // Área actual
        String area = iEmpleadoArea.findTopByEmployee_IdOrderByIdDesc(employeeId)
                .map(ea -> ea.getArea().getNameArea())
                .orElse("Área no definida");

        String html = buildHtml(emp, cont, cargo, area);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(html);
        renderer.layout();
        renderer.createPDF(baos);
        return baos.toByteArray();
    }

    public byte[] generateCertificateByEmail(String email) throws Exception {
        employee emp = iEmployee.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        return generateCertificate(emp.getId());
    }

    private String buildHtml(employee emp, contract cont, String cargo, String area) {
        LocalDate now = LocalDate.now();
        return """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { font-family: Arial, Helvetica, sans-serif; margin: 50px; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid #b00; padding-bottom: 10px; margin-bottom: 30px; }
                    .header h2 { margin: 0; color: #b00; }
                    .title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 40px; color: #b00; }
                    .content { text-align: justify; font-size: 14px; }
                    .signature { margin-top: 80px; }
                    .signature-line { margin-top: 40px; border-top: 1px solid #000; width: 250px; }
                    .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #666; }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <h2>LAS BRISAS - Talento Humano</h2>
                  </div>
                  <div class="title">CERTIFICADO LABORAL</div>
                  <div class="content">
                    <p>La empresa <strong>LAS BRISAS</strong> certifica que el(la) señor(a)
                      <strong>%s %s</strong>, identificado(a) con
                      <strong>%s No. %s</strong>, labora en nuestra organización
                      desde el <strong>%s</strong> desempeñando el cargo de
                      <strong>%s</strong> en el área de <strong>%s</strong>.
                    </p>
                    <p>El presente certificado se expide a solicitud del interesado para los fines que estime convenientes,
                      a los <strong>%d</strong> días del mes de <strong>%s</strong> de <strong>%d</strong>.
                    </p>
                  </div>
                  <div class="signature">
                    <p>Atentamente,</p>
                    <div class="signature-line"></div>
                    <p><strong>Recursos Humanos</strong><br/>Las Brisas</p>
                  </div>
                  <div class="footer">
                    <p>Las Brisas - Sistema de Gestión de Talento Humano<br/>
                    Dirección: Calle 123, Bogotá, Colombia | Tel: (601) 555 1234</p>
                  </div>
                </body>
                </html>
                """
                .formatted(
                        emp.getFirstName(), emp.getLastName(),
                        emp.getTipoDocumento(), emp.getDocumentNumber(),
                        cont.getFechaInicio(),
                        cargo,
                        area,
                        now.getDayOfMonth(), now.getMonth(), now.getYear());
    }
}
