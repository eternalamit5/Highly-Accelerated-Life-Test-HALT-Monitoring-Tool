from globalImports import *


def spectrogram_lib(fs, samples, start_time_epoch_ns, window_size, overlap_size):
    x = samples
    window_param = signal.get_window(('tukey', 0.25), window_size, False)
    f, t, magnitude = signal.spectrogram(x, fs, window=window_param, noverlap=overlap_size)

    # Time axis correction
    time_axis = t
    time_axis += (start_time_epoch_ns / 1e6)
    return f, time_axis, magnitude


# def spectrogram_lib2(data, sample_rate, window_size, overlap_size):
#     frequency_bin_size = sample_rate / len(data)
#     # Start by chopping up the signal into slices of window_size samples, each slice overlapping the previous by
#     # overlap_size samples
#     slices = util.view_as_windows(data, window_shape=(window_size,), step=overlap_size)
#     # Generate a windowing function
#     win = np.hanning(window_size + 1)[:-1]
#     # multiply windowing function with the signal
#     slices = slices * win
#     # convert to one slice per column
#     slices = slices.T
#     # For each slice, calculate the DFT, which returns both positive and negative frequencies
#     spectrum = np.fft.fft(slices, axis=0)[:window_size // 2 + 1:-1]
#     # we slice out the positive M2 frequencies
#     spectrum = np.abs(spectrum)
#     result = np.abs(spectrum)
#     result = 20 * np.log10(result / np.max(result))
#     return result, frequency_bin_size, sample_rate


def plot_spectrogram(data, frequency_bin_size, sample_rate):
    f, ax = plt.subplots()
    ax.imshow(data, origin='lower', cmap='viridis',
              extent=(0, 1 / frequency_bin_size, 0, sample_rate / 2))
    ax.axis('tight')
    ax.set_ylabel('Frequency [Hz]')
    ax.set_xlabel('Time [s]');
    plt.show()


def generate_fft(data, sampleFrequency):
    magnitude = fftpack.fft(data)
    frequency = fftpack.fftfreq(len(data)) * sampleFrequency
    return magnitude, frequency


def freq_analysis_time_series_data(operation, data, measurement_name, tag_name, sample_freq, window_size=1024,
                             overlap_size=0):
    df = pd.DataFrame(data[measurement_name], columns=[tag_name])
    flat_df = [item for sublist in df.values for item in sublist]
    if operation == "spectrogram":
        return spectrogram_lib(float(sample_freq), np.array(flat_df), 0, int(window_size), int(overlap_size))
    elif operation == "fft":
        return generate_fft(np.array(flat_df), float(sample_freq))
