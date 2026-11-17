/** Quản lý state nhập, tải và lưu địa chỉ API demo. */
import { useEffect, useState } from "react";

import {
  getSavedDemoApiBaseUrl,
  saveDemoApiBaseUrl,
} from "../services/demo-api-settings";

export function useDemoApiSettings() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(function loadSavedApiAddress() {
    let isActive = true;

    void getSavedDemoApiBaseUrl()
      .then(function applySavedAddress(savedUrl) {
        if (isActive && savedUrl !== null) {
          setValue(savedUrl);
        }
      })
      .catch(function showStorageError() {
        if (isActive) {
          setMessage("Unable to load the saved API address.");
        }
      });

    return function cancelLoading() {
      isActive = false;
    };
  }, []);

  async function save(): Promise<void> {
    setIsSaving(true);
    setMessage(null);

    try {
      const normalizedUrl = await saveDemoApiBaseUrl(value);
      setValue(normalizedUrl);
      setMessage("API address saved.");
    } catch (cause) {
      if (cause instanceof Error) {
        setMessage(cause.message);
      } else {
        setMessage("Unable to save the API address.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return { value, setValue, message, isSaving, save };
}
