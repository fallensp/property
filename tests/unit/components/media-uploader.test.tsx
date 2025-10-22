import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { MediaUploader } from '@/app/(listing)/listing/create/components/media-uploader';

describe('MediaUploader', () => {
  it('invokes callbacks for actions', async () => {
    const user = userEvent.setup();
    const onUploadClick = vi.fn();
    const onAddSampleClick = vi.fn();
    const onRemove = vi.fn();
    const onMakeCover = vi.fn();
    const onMoveLeft = vi.fn();
    const onMoveRight = vi.fn();
    const onFilesSelected = vi.fn();

    const ref = createRef<HTMLInputElement>();

    render(
      <MediaUploader
        ref={ref}
        photos={[
          {
            id: 'photo-1',
            url: 'https://example.com/photo-1.jpg',
            altText: 'Photo 1',
            tag: 'Exterior',
            isCover: true
          },
          {
            id: 'photo-2',
            url: 'https://example.com/photo-2.jpg',
            altText: 'Photo 2',
            tag: 'Interior',
            isCover: false
          }
        ]}
        onUploadClick={onUploadClick}
        onAddSampleClick={onAddSampleClick}
        onRemove={onRemove}
        onMakeCover={onMakeCover}
        onMoveLeft={onMoveLeft}
        onMoveRight={onMoveRight}
        minimumRequired={5}
        onFilesSelected={onFilesSelected}
      />
    );

    await user.click(screen.getByRole('button', { name: /upload photos/i }));
    expect(onUploadClick).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /add sample photos/i }));
    expect(onAddSampleClick).toHaveBeenCalled();

    const moveRightButtons = screen.getAllByTitle(/move right/i);
    await user.click(moveRightButtons[0]);
    expect(onMoveRight).toHaveBeenCalledWith('photo-1');

    const moveLeftButtons = screen.getAllByTitle(/move left/i);
    await user.click(moveLeftButtons[1]);
    expect(onMoveLeft).toHaveBeenCalledWith('photo-2');

    await user.click(screen.getByTitle(/make cover/i));
    expect(onMakeCover).toHaveBeenCalledWith('photo-2');

    const removeButtons = screen.getAllByTitle(/remove photo/i);
    await user.click(removeButtons[0]);
    expect(onRemove).toHaveBeenCalledWith('photo-1');

    const file = new File(['demo'], 'demo.png', { type: 'image/png' });
    if (ref.current) {
      fireEvent.change(ref.current, { target: { files: [file] } });
      expect(onFilesSelected).toHaveBeenCalledWith(ref.current);
    }
  });
});
