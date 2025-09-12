// Inicia import (envía JSON con file_contents o server_path)
async function startImport(jsonBody) {
	const res = await fetch('/reportesApi/import/incidents', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
		body: JSON.stringify(jsonBody),
	});
	const j = await res.json();
	if (!j.ok) throw new Error(j.error || 'start failed');
	const jobId = j.job_id;
	// poll
	const interval = 1000;
	const poll = setInterval(async () => {
		const s = await fetch(`/reportesApi/import/status?id=${jobId}`, {
			headers: { Authorization: 'Bearer ' + token },
		});
		const sJ = await s.json();
		if (!sJ.ok) {
			console.error('status error', sJ);
			clearInterval(poll);
			return;
		}
		const pct = parseInt(sJ.job.percent, 10);
		console.log('progress', sJ.job.processed, '/', sJ.job.total, pct + '%');
		if (sJ.job.status === 'finished' || pct >= 100) {
			console.log('done');
			clearInterval(poll);
		}
	}, interval);
}
