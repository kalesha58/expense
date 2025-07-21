import { useEffect, useState } from 'react';

export interface Department {
  DepartmentID: string;
  DepartmentCode: string;
  DepartmentName: string;
  Flag: string;
  SyncStatus: string;
}

interface ApiResponse {
  Response: Department[];
  Success: boolean;
}

const API_URL = 'https://testnode.propelapps.com/EBS/23B/getAllDepartments/%22%22';

export default function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data: ApiResponse) => {
        if (isMounted) {
          if (data.Success) {
            setDepartments(Array.isArray(data.Response) ? data.Response : []);
          } else {
            setDepartments([]);
            setError('API response not successful.');
          }
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
          setDepartments([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return { departments, loading, error };
}
