export default function Table({ data }: { data: unknown[] }) {
  if (!data || data.length === 0) return <p>Sin datos</p>;

  const keys = Object.keys(data[0] as object);

  return (
    <table border={1} cellPadding={8}>
      <thead>
        <tr>
          {keys.map((k) => (
            <th key={k}>{k}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {keys.map((k) => (
              <td key={k}>{String((row as Record<string, unknown>)[k])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
