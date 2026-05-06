"""
PDF Report Generator

Uses ReportLab to generate OPORD and MDMP summary PDFs.
"""

import io
from typing import List
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

from mdmp.models import MDMPOutput, OPORDParagraph


def generate_mdmp_pdf(output: MDMPOutput) -> bytes:
    """Generate a PDF report for a completed MDMP run."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=18)
    styles = getSampleStyleSheet()
    story = []

    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=colors.black,
        spaceAfter=12,
    )
    heading2 = ParagraphStyle(
        'CustomH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=colors.darkblue,
        spaceAfter=10,
    )
    normal = styles["BodyText"]

    story.append(Paragraph(
        f"IRONFORGE MDMP REPORT — RUN {output.run_id[:8].upper()}", title_style))
    story.append(Spacer(1, 0.2 * inch))

    # Step 1
    story.append(Paragraph("STEP 1 — RECEIPT OF MISSION", heading2))
    story.append(
        Paragraph(f"Classification: {output.receipt.classification.upper()}", normal))
    story.append(Paragraph(
        f"Time Available: {output.receipt.time_available_hours} hours", normal))
    story.append(
        Paragraph(f"Assessment: {output.receipt.initial_assessment}", normal))
    story.append(Spacer(1, 0.1 * inch))

    # Step 2
    story.append(Paragraph("STEP 2 — MISSION ANALYSIS", heading2))
    story.append(Paragraph(
        f"Restated Mission: {output.mission_analysis.restated_mission}", normal))
    story.append(
        Paragraph(f"METT-TC Enemy: {output.mission_analysis.mett_tc.enemy}", normal))
    story.append(Spacer(1, 0.1 * inch))

    # COAs
    story.append(Paragraph("STEP 3 — COURSES OF ACTION", heading2))
    for coa in output.coas:
        story.append(Paragraph(f"<b>{coa.coa_id}</b>: {coa.name}", normal))
        story.append(Paragraph(f"Description: {coa.description}", normal))
        story.append(
            Paragraph(f"Decisive Operation: {coa.decisive_operation}", normal))
        story.append(Spacer(1, 0.05 * inch))

    story.append(PageBreak())

    # Wargaming
    story.append(Paragraph("STEP 4 — COA ANALYSIS (WARGAMING)", heading2))
    for analysis in output.coa_analyses:
        story.append(Paragraph(f"<b>{analysis.coa_id}</b>", normal))
        for seq in analysis.wargame_sequences:
            story.append(Paragraph(
                f"Sequence {seq.sequence_num}: {seq.friendly_action} | Enemy: {seq.enemy_reaction} | Counter: {seq.friendly_counteraction}", normal))
        story.append(Spacer(1, 0.05 * inch))

    # Comparison
    story.append(Paragraph("STEP 5 — COA COMPARISON", heading2))
    table_data = [["COA", "Criterion", "Raw", "Weight", "Weighted"]]
    for comp in output.coa_comparisons:
        for s in comp.scores:
            table_data.append([comp.coa_id, s.criterion, str(
                s.raw_score), str(s.weight), str(s.weighted_score)])
        table_data.append(
            [comp.coa_id, "TOTAL", "", "", str(comp.total_score)])
    t = Table(table_data, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.1 * inch))

    # Approval
    story.append(Paragraph("STEP 6 — COA APPROVAL", heading2))
    story.append(Paragraph(
        f"Recommended: {output.approval.recommended_coa_name} ({output.approval.recommended_coa_id})", normal))
    story.append(
        Paragraph(f"Justification: {output.approval.justification}", normal))
    story.append(Spacer(1, 0.1 * inch))

    # OPORD
    story.append(Paragraph("STEP 7 — OPORD FRAGMENT", heading2))
    story.append(Paragraph("SITUATION", heading2))
    for p in output.opord.situation:
        story.append(
            Paragraph(f"{p.paragraph_num} {p.title}: {p.text}", normal))
    story.append(Paragraph("MISSION", heading2))
    for p in output.opord.mission:
        story.append(
            Paragraph(f"{p.paragraph_num} {p.title}: {p.text}", normal))
    story.append(Paragraph("EXECUTION", heading2))
    for p in output.opord.execution:
        story.append(
            Paragraph(f"{p.paragraph_num} {p.title}: {p.text}", normal))
    story.append(Paragraph("SUSTAINMENT", heading2))
    for p in output.opord.sustainment:
        story.append(
            Paragraph(f"{p.paragraph_num} {p.title}: {p.text}", normal))
    story.append(Paragraph("COMMAND AND SIGNAL", heading2))
    for p in output.opord.command_and_signal:
        story.append(
            Paragraph(f"{p.paragraph_num} {p.title}: {p.text}", normal))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()
