import { createSignal, onCleanup, onMount } from 'solid-js';
import styles from './Dashboard.module.css';

export default function TampilanAwal() {
  const [totalUsers, setTotalUsers] = createSignal(0);
  const [totalMen, setTotalMen] = createSignal(0);
  const [totalWomen, setTotalWomen] = createSignal(0);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/pengguna/gender');
      if (!response.ok) {
        throw new Error('Failed to fetch gender data');
      }
      const genderData = await response.json();

      let total = 0;
      let maleCount = 0;
      let femaleCount = 0;

      genderData.forEach((data) => {
        total += data.count;
        if (data.gender === 'male') {
          maleCount = data.count;
        } else if (data.gender === 'female') {
          femaleCount = data.count;
        }
      });

      setTotalUsers(total);
      setTotalMen(maleCount);
      setTotalWomen(femaleCount);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch data on mount and set up polling
  onMount(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 500); // Fetch every 5 seconds

    // Cleanup interval on component unmount
    onCleanup(() => clearInterval(intervalId));
  });

  return (
    <div class={styles.dashboardContainer}>
      <div class={styles.statsContainer}>
        <div class={styles.statBox}>
          <p>Total Pengguna</p>
          <h3>{totalUsers().toLocaleString()}</h3>
          {/*<img src={} alt="Total Pengguna" />*/}
        </div>
        <div class={styles.statBox}>
          <p>Total Pengguna Pria</p>
          <h3>{totalMen().toLocaleString()}</h3>
          {/*<img src={} alt="Pengguna Pria" />*/}
        </div>
        <div class={styles.statBox}>
          <p>Total Pengguna Wanita</p>
          <h3>{totalWomen().toLocaleString()}</h3>
          {/*<img src={} alt="Pengguna Wanita" />*/}
        </div>
      </div>
    </div>
  );
}
