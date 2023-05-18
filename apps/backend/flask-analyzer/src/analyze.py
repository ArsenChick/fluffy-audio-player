import os
import requests
import numpy as np
import essentia.standard as es

MODELS_PATH = '/app/tf-models/'

def analyze_file(filename=None):
    if filename is None:
        raise ValueError

    extension = os.path.splitext(filename)
    file_path = f'/app/uploads/audio{extension}'

    url = f'http://minio:9000/audio/{filename}'
    myfile = requests.get(url, allow_redirects=True)
    with open(file_path, 'wb') as f:
        f.write(myfile.content)

    audio = es.MonoLoader(filename=file_path)()
    audio_downsampled = es.MonoLoader(
        filename=file_path,
        sampleRate=16000)()
    keys = ['bpm', 'beats', 'key', 'scale', 'happiness', 'danceability', 'sadness']

    rhythm_ext = es.RhythmExtractor2013(method="multifeature")
    bpm, beats, beat_conf, beat_est, beat_int = rhythm_ext(audio)
    bpm = int(bpm)
    beats = np.around(beats * 1000).astype(int)

    key_ext = es.KeyExtractor()
    key, scale, strength = key_ext(audio)

    happy_prob = es.TensorflowPredictMusiCNN(
        graphFilename=MODELS_PATH + 'mood_happy-musicnn-msd-2.pb')(audio_downsampled)
    dance_prob = es.TensorflowPredictMusiCNN(
        graphFilename=MODELS_PATH + 'danceability-musicnn-msd-2.pb')(audio_downsampled)
    sad_prob = es.TensorflowPredictMusiCNN(
        graphFilename=MODELS_PATH + 'mood_sad-musicnn-msd-2.pb')(audio_downsampled)


    happy, _ = happy_prob.mean(axis=0).tolist()
    dance, _ = dance_prob.mean(axis=0).tolist()
    _, sad = sad_prob.mean(axis=0).tolist()
    values = [ bpm, beats.tolist(), key, scale, happy, dance, sad ]

    res_dict = {}
    for k, v in zip(keys, values):
        res_dict[k] = v

    os.remove(file_path)
    return res_dict
