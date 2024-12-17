export async function getAvailableInstances(): Promise<{ url: string; istanza: string }[]> {
  const res = await fetch("https://salespartner.cloud/ISTANZE.txt", {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  });
  const data = await res.text();
  const response = data.replace(/\n/g, "").replace(/\s/g, "").split(";").filter(Boolean);
  const formatted = response.map((r) => {
    const [url, istanza] = r.split("/");
    return {
      url,
      istanza,
    };
  });
  return formatted;
}
