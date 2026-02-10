import fitz  # PyMuPDF
import os
from pathlib import Path

# Source folder with PDFs
pdf_folder = Path(r"C:\Users\Yigit\Desktop\2022_09_30_MHB_BSC_INF-split\2022_09_30_MHB_BSC_INF-split")

# Output folder for text files
output_folder = Path(r"C:\Users\Yigit\Desktop\Career-Roadmap-FINAL-v3\docs\course-pdfs-text")
output_folder.mkdir(parents=True, exist_ok=True)

# Process each PDF
for pdf_file in sorted(pdf_folder.glob("*.pdf")):
    print(f"Processing: {pdf_file.name}")

    try:
        doc = fitz.open(pdf_file)
        text = ""

        for page_num, page in enumerate(doc, 1):
            text += f"\n{'='*60}\n"
            text += f"PAGE {page_num}\n"
            text += f"{'='*60}\n\n"
            text += page.get_text()

        doc.close()

        # Save to text file
        output_file = output_folder / f"{pdf_file.stem}.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(text)

        print(f"  -> Saved: {output_file.name}")

    except Exception as e:
        print(f"  ERROR: {e}")

print(f"\nDone! All text files saved to: {output_folder}")
