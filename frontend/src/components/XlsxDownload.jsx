import { ledgerXlsx } from "../api/xlsxDownloadLedger";

const XlsxDownload = ({ date }) => {
  const handleDownload = async () => {
    try {
      const response = await ledgerXlsx(date);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ledger_${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        className="bg-blue-600 hover:bg-blue-500 rounded text-white py-2 px-4 cursor-pointer"
      >
        Download ledger
      </button>
    </div>
  );
};

export default XlsxDownload;
